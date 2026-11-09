const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: [String],
    },
    sizes: {
        type: [String],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    collections: {
        type: String,
        required: true,
    },
    material: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        altText: {
            type: String,
        },
    },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    }, 
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    metaKeywords: {
        type: String,
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
    weight: Number,
    },
    {timestamps: true}
);

// Indexes for the storefront's filters and sorts
productSchema.index({ createdAt: -1 }); // new arrivals
productSchema.index({ rating: -1 }); // best seller, sort by popularity
productSchema.index({ price: 1 }); // price sort and range filter
productSchema.index({ category: 1, gender: 1 }); // category pages, home sections, similar products
productSchema.index({ collections: 1 });

module.exports = mongoose.model("Product", productSchema);