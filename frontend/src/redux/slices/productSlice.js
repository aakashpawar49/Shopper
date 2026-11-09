import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Filter keys forwarded to GET /api/products as query parameters
const FILTER_KEYS = [
    "size",
    "color",
    "gender",
    "minPrice",
    "maxPrice",
    "sortBy",
    "search",
    "category",
    "material",
    "brand",
    "limit",
];

// Fetch products matching the given filters. `collection` comes from the
// /collections/:collection route and maps to the backend's `collections` param.
export const fetchProductsByFilters = createApiThunk(
    "products/fetchByFilters",
    ({ collection, ...filters } = {}) => {
        const params = {};
        if (collection) params.collections = collection;
        FILTER_KEYS.forEach((key) => {
            if (filters[key]) params[key] = filters[key];
        });
        return { url: "/api/products", params };
    },
    (data) => (Array.isArray(data) ? data : [])
);

// Fetch a single product by ID
export const fetchProductDetails = createApiThunk(
    "products/fetchProductDetails",
    (id) => ({ url: `/api/products/${id}` })
);

// Fetch products similar to the given product
export const fetchSimilarProducts = createApiThunk(
    "products/fetchSimilarProducts",
    ({ id }) => ({ url: `/api/products/similar/${id}` }),
    (data) => (Array.isArray(data) ? data : [])
);

// The list, the product details and the similar products have their own
// loading/error flags, so loading one never blanks out another on the same page.
const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        // Starts true: pages showing the list fetch it on mount, and this avoids
        // a flash of "No products found" before the first request starts.
        loading: true,
        error: null,
        productDetails: null,
        detailsLoading: false,
        detailsError: null,
        similarProducts: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                // An aborted request was replaced by a newer one that is still loading
                if (action.meta.aborted) return;
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.productDetails = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.detailsLoading = false;
                state.detailsError = rejectedMessage(action);
            })
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.similarProducts = [];
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.similarProducts = action.payload;
            });
    },
});

export default productSlice.reducer;
