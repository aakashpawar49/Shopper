const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

const PRODUCT_NOT_FOUND = { message: "Product not found" };

// Fields an admin can set when creating or updating a product
const EDITABLE_FIELDS = [
    "name",
    "description",
    "price",
    "discountPrice",
    "countInStock",
    "category",
    "brand",
    "sizes",
    "colors",
    "collections",
    "material",
    "gender",
    "images",
    "isFeatured",
    "isPublished",
    "tags",
    "dimensions",
    "weight",
    "sku",
];

const SORT_OPTIONS = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    popularity: { rating: -1 },
};

// Escape user input so it is matched literally inside a RegExp
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Let browsers reuse rarely-changing storefront responses for a short time
const publicCache = (seconds) => (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${seconds}`);
    next();
};

router.param("id", validateObjectId(PRODUCT_NOT_FOUND));

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const data = {};
        for (const field of EDITABLE_FIELDS) {
            if (req.body[field] !== undefined) data[field] = req.body[field];
        }

        const createdProduct = await Product.create({ ...data, user: req.user.id });
        res.status(201).json(createdProduct);
    })
);

// @route PUT /api/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json(PRODUCT_NOT_FOUND);

        // Only overwrite fields that were sent with a value. Empty strings keep
        // the current value; 0 and false are real values (e.g. out of stock).
        for (const field of EDITABLE_FIELDS) {
            const value = req.body[field];
            if (value !== undefined && value !== null && value !== "") {
                product[field] = value;
            }
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    })
);

// @route DELETE /api/products/:id
// @desc Delete product by ID
// @access Private/Admin
router.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json(PRODUCT_NOT_FOUND);

        res.json({ message: "Product removed" });
    })
);

// @route GET /api/products
// @desc Get all the products with optional query filters
// @access Public
router.get(
    "/",
    asyncHandler(async (req, res) => {
        // Ignore repeated (array) parameters; every filter expects one string
        const params = Object.fromEntries(
            Object.entries(req.query).filter(([, value]) => typeof value === "string")
        );
        const {
            collections,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
        } = params;

        const query = {};

        if (collections && collections.toLowerCase() !== "all") {
            query.collections = collections;
        }
        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }
        if (material) query.material = { $in: material.split(",") };
        if (brand) query.brand = { $in: brand.split(",") };
        if (size) query.sizes = { $in: size.split(",") };
        if (color) query.colors = color;
        if (gender) query.gender = gender;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            const pattern = new RegExp(escapeRegex(search), "i");
            query.$or = [{ name: pattern }, { description: pattern }];
        }

        const sort = Object.hasOwn(SORT_OPTIONS, sortBy) ? SORT_OPTIONS[sortBy] : {};

        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0)
            .lean();
        res.json(products);
    })
);

// @route GET /api/products/best-seller
// @desc Get best-selling product
// @access Public
router.get(
    "/best-seller",
    publicCache(60),
    asyncHandler(async (req, res) => {
        const bestSeller = await Product.findOne().sort({ rating: -1 }).lean();
        if (!bestSeller) return res.status(404).json({ message: "No Best seller found" });

        res.json(bestSeller);
    })
);

// @route GET /api/products/new-arrivals
// @desc Get the 8 latest products
// @access Public
router.get(
    "/new-arrivals",
    publicCache(60),
    asyncHandler(async (req, res) => {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
        res.json(newArrivals);
    })
);

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json(PRODUCT_NOT_FOUND);

        res.json(product);
    })
);

// @route GET /api/products/similar/:id
// @desc Get similar products based on current product's gender and category
// @access Public
router.get(
    "/similar/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findById(id).select("gender category").lean();
        if (!product) return res.status(404).json(PRODUCT_NOT_FOUND);

        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        })
            .limit(4)
            .lean();

        res.json(similarProducts);
    })
);

module.exports = router;
