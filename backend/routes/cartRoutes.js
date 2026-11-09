const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// Filter for a logged-in user's or a guest's cart. Only non-empty strings are
// accepted so request values can't inject MongoDB operators.
const cartFilter = (userId, guestId) => {
    if (typeof userId === "string" && userId) return { user: userId };
    if (typeof guestId === "string" && guestId) return { guestId };
    return null;
};

const getCart = (userId, guestId) => {
    const filter = cartFilter(userId, guestId);
    return filter ? Cart.findOne(filter) : Promise.resolve(null);
};

// A cart line is identified by product, size and color
const findLineIndex = (cart, { productId, size, color }) =>
    cart.products.findIndex(
        (item) =>
            item.productId.toString() === String(productId) &&
            item.size === size &&
            item.color === color
    );

const updateTotal = (cart) => {
    cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged-in user
// @access Public
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { productId, quantity, size, color, guestId, userId } = req.body;

        if (!mongoose.isObjectIdOrHexString(productId)) {
            return res.status(404).json({ message: "Product not found" });
        }

        const [product, cart] = await Promise.all([
            Product.findById(productId).select("name price images").lean(),
            getCart(userId, guestId),
        ]);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const qty = Number(quantity) > 0 ? Number(quantity) : 1;

        if (cart) {
            const index = findLineIndex(cart, { productId, size, color });
            if (index > -1) {
                cart.products[index].quantity += qty;
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: qty,
                });
            }

            updateTotal(cart);
            await cart.save();
            return res.status(200).json(cart);
        }

        const newCart = await Cart.create({
            user: userId || undefined,
            guestId: guestId || `guest_${Date.now()}`,
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: qty,
                },
            ],
            totalPrice: product.price * qty,
        });

        res.status(201).json(newCart);
    })
);

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged-in user
// @access Public
router.put(
    "/",
    asyncHandler(async (req, res) => {
        const { productId, quantity, size, color, guestId, userId } = req.body;

        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(400).json({ message: "Cart not found" });

        const index = findLineIndex(cart, { productId, size, color });
        if (index === -1) {
            return res.status(400).json({ message: "Product not found in cart" });
        }

        if (quantity > 0) {
            cart.products[index].quantity = quantity;
        } else {
            cart.products.splice(index, 1); // Remove if quantity is 0
        }

        updateTotal(cart);
        await cart.save();
        res.status(200).json(cart);
    })
);

// @route DELETE /api/cart
// @desc Remove product from the cart
// @access Public
router.delete(
    "/",
    asyncHandler(async (req, res) => {
        const { productId, size, color, guestId, userId } = req.body;

        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const index = findLineIndex(cart, { productId, size, color });
        if (index === -1) {
            return res.status(400).json({ message: "Product not found in cart" });
        }

        cart.products.splice(index, 1);
        updateTotal(cart);
        await cart.save();
        res.status(200).json(cart);
    })
);

// @route GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const filter = cartFilter(req.query.userId, req.query.guestId);
        const cart = filter && (await Cart.findOne(filter).lean());
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.json(cart);
    })
);

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post(
    "/merge",
    protect,
    asyncHandler(async (req, res) => {
        const { guestId } = req.body;

        const [guestCart, userCart] = await Promise.all([
            getCart(undefined, guestId),
            Cart.findOne({ user: req.user._id }),
        ]);

        // Guest cart already merged (or it is the user's own cart): return the user cart
        if (!guestCart || (userCart && guestCart._id.equals(userCart._id))) {
            if (userCart) return res.status(200).json(userCart);
            return res.status(400).json({ message: "Guest cart not found" });
        }

        if (guestCart.products.length === 0) {
            return res.status(400).json({ message: "Guest cart is empty" });
        }

        if (!userCart) {
            // The user has no cart yet, so the guest cart becomes theirs
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json(guestCart);
        }

        // Merge the guest items into the user cart
        for (const guestItem of guestCart.products) {
            const index = findLineIndex(userCart, guestItem);
            if (index > -1) {
                userCart.products[index].quantity += guestItem.quantity;
            } else {
                userCart.products.push(guestItem);
            }
        }

        updateTotal(userCart);
        await userCart.save();

        // Remove the merged guest cart; failing to do so shouldn't fail the merge
        await Cart.deleteOne({ _id: guestCart._id }).catch((error) =>
            console.error("Error deleting guest cart:", error)
        );

        res.status(200).json(userCart);
    })
);

module.exports = router;
