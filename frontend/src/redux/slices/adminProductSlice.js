import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Fetch all products for the admin dashboard
export const fetchAdminProducts = createApiThunk(
    "adminProducts/fetchProducts",
    () => ({ url: "/api/admin/products", requiresAuth: true }),
    (data) => (Array.isArray(data) ? data : [])
);

// Create a product
export const createProduct = createApiThunk(
    "adminProducts/createProduct",
    (productData) => ({
        method: "post",
        url: "/api/products",
        data: productData,
        requiresAuth: true,
    })
);

// Update a product
export const updateProduct = createApiThunk(
    "adminProducts/updateProduct",
    ({ id, productData }) => ({
        method: "put",
        url: `/api/products/${id}`,
        data: productData,
        requiresAuth: true,
    })
);

// Delete a product and return its ID
export const deleteProduct = createApiThunk(
    "adminProducts/deleteProduct",
    (id) => ({ method: "delete", url: `/api/products/${id}`, requiresAuth: true }),
    (_data, id) => id
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            });
    },
});

export default adminProductSlice.reducer;
