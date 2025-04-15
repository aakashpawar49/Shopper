import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to Fetch Products by Collection and optional Features
export const fetchProductsByFilters = createAsyncThunk(
    "products/fetchByFilters",
    async ({
        collection,
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
        limit, // FIXED: limit added to destructuring
    }) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );
        return response.data;
    }
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        return response.data;
    }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`, // FIXED: syntax
                },
            }
        );
        return response.data;
    }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
        );
        return response.data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        productDetails: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetails = action.payload; // FIXED: match initialState
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // FIXED: assignment syntax
            })

            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id // FIXED: used action.payload
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilters } = productSlice.actions;
export default productSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async Thunk to Fetch Products by Collection and optional Features
// export const fetchProductsByFilters = createAsyncThunk(
//     "products/fetchByFilters",
//     async({
//         collection,
//         size,
//         color,
//         gender,
//         minPrice,
//         maxPrice,
//         sortBy,
//         search,
//         category,
//         material,
//         brand,
//     }) => {
//         const query = new URLSearchParams();
//         if (collection) query.append('collection', collection);
//         if (size) query.append("size", size);
//         if (color) query.append("color", color);
//         if (gender) query.append("gender", gender);
//         if (minPrice) query.append("minPrice", minPrice);
//         if (maxPrice) query.append("maxPrice", maxPrice);
//         if (sortBy) query.append("sortBy", sortBy);
//         if (search) query.append("search", search);
//         if (category) query.append("category", category);
//         if (material) query.append("material", material);
//         if (brand) query.append("brand", brand);
//         if (limit) query.append("limit", limit);

//         const response = await axios.get(
//            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch a single product by ID
// export const fetchProductDetails = createAsyncThunk(
//     "products/fetchProductDetails",
//     async (id) => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
//         );
//     return response.data;
//     }
// );

// // Async thunk to fetch similar products
// export const updateProduct = createAsyncThunk(
//     "products/updateProduct",
//     async ({ id, productData }) => {
//         const response = await axios.put(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
//             productData,
//             {
//                 headers: {
//                     Authorization: Bearer `${localStorage.getItem("userToken")}`,
//                 },
//             }
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch similar products
// export const fetchSimilarProducts = createAsyncThunk(
//     "products/fetchSimilarProducts",
//     async ({ id }) => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
//         );
//         return response.data;
//     }
// );

// const productSlice = createSlice({
//     name: "products",
//     initialState: {
//         products: [],
//         productDetails: null, // Store the details of single product
//         similarProducts: [],
//         loading: false,
//         error: null,
//         filters: {
//             category: "",
//             size: "",
//             color: "",
//             gender: "",
//             brand: "",
//             minPrice: "",
//             maxPrice: "",
//             sortBy: "",
//             search: "",
//             material: "",
//             collection: "",
//         },
//     },
//     reducers: {
//         setFilters: (state, action) => {
//             state.filters = {
//                 category: "",
//                 size: "",
//                 color: "",
//                 gender: "",
//                 brand: "",
//                 minPrice: "",
//                 maxPrice: "",
//                 sortBy: "",
//                 search: "",
//                 material: "",
//                 collection: "",
//             };
//         }, 
//     },
//     extraReducers: (builder) => {
//         builder
//     // handle fetching products with filter
//         .addCase(fetchProductsByFilters.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
//             state.loading = false;
//             state.products = Array.isArray(action.payload) ? action.payload : [];
//         })
//         .addCase(fetchProductsByFilters.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message;
//         })
//     // Handle fetching single product details
//         .addCase(fetchProductDetails.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(fetchProductDetails.fulfilled, (state, action) => {
//             state.loading = false;
//             state.selectedProduct = action.payload;
//         })
//         .addCase(fetchProductDetails.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message;
//         })

//     // Handle updating product
//         .addCase(updateProduct.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(updateProduct.fulfilled, (state) => {
//             state.loading = false;
//             state.error = action.payload;
//             const index = state.products.findIndex(
//                 (product) => product._id === updateProduct._id
//             );
//             if (index !== -1) {
//                 state.products[index] = action.payload;
//             }
//         })
//         .addCase(updateProduct.rejected, (state) => {
//             state.loading = false;
//             state.error = action.error.message;
//         })
//         .addCase(fetchSimilarProducts.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
//             state.loading = false;
//             state.products = action.payload;
//         })
//         .addCase(fetchSimilarProducts.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message;
//         })
//     },
// });

// export const { setFilters, clearFilters } = productSlice.actions;
// export default productSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async Thunk to Fetch Products by Collection and optional Features
// export const fetchProductsByFilters = createAsyncThunk(
//     "products/fetchByFilters",
//     async ({
//         collection,
//         size,
//         color,
//         gender,
//         minPrice,
//         maxPrice,
//         sortBy,
//         search,
//         category,
//         material,
//         brand,
//         limit, // Added to destructure limit properly
//     }) => {
//         const query = new URLSearchParams();
//         if (collection) query.append('collection', collection);
//         if (size) query.append("size", size);
//         if (color) query.append("color", color);
//         if (gender) query.append("gender", gender);
//         if (minPrice) query.append("minPrice", minPrice);
//         if (maxPrice) query.append("maxPrice", maxPrice);
//         if (sortBy) query.append("sortBy", sortBy);
//         if (search) query.append("search", search);
//         if (material) query.append("material", material);
//         if (brand) query.append("brand", brand);
//         if (limit) query.append("limit", limit);

//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch a single product by ID
// export const fetchProductDetails = createAsyncThunk(
//     "products/fetchProductDetails",
//     async (id) => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
//         );
//         return response.data;
//     }
// );

// // Async thunk to update a product
// export const updateProduct = createAsyncThunk(
//     "products/updateProduct",
//     async ({ id, productData }) => {
//         const response = await axios.put(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
//             productData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//                 },
//             }
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch similar products
// export const fetchSimilarProducts = createAsyncThunk(
//     "products/fetchSimilarProducts",
//     async ({ id }) => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
//         );
//         return response.data;
//     }
// );

// const productSlice = createSlice({
//     name: "products",
//     initialState: {
//         products: [],
//         productDetails: null, // Updated key to match usage
//         similarProducts: [],
//         loading: false,
//         error: null,
//         filters: {
//             category: "",
//             size: "",
//             color: "",
//             gender: "",
//             brand: "",
//             minPrice: "",
//             maxPrice: "",
//             sortBy: "",
//             search: "",
//             material: "",
//             collection: "",
//         },
//     },
//     reducers: {
//         setFilters: (state, action) => {
//             state.filters = {
//                 category: "",
//                 size: "",
//                 color: "",
//                 gender: "",
//                 brand: "",
//                 minPrice: "",
//                 maxPrice: "",
//                 sortBy: "",
//                 search: "",
//                 material: "",
//                 collection: "",
//             };
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // handle fetching products with filter
//             .addCase(fetchProductsByFilters.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = Array.isArray(action.payload) ? action.payload : [];
//             })
//             .addCase(fetchProductsByFilters.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })
//             // Handle fetching single product details
//             .addCase(fetchProductDetails.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductDetails.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.productDetails = action.payload; // fixed key usage
//             })
//             .addCase(fetchProductDetails.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message; // fixed assignment
//             });
//     },
// });

// export const { setFilters } = productSlice.actions;
// export default productSlice.reducer;




// OLD replaced code
// Errors:
// ReferenceError – limit is used in fetchProductsByFilters but never declared or passed as a parameter.
// Logical Error – In fetchProductDetails.rejected, you're using state.error - action.error.message; which should be state.error = action.error.message;.
// Missing Export – productSlice.reducer is not exported at the end of the file.
// Inconsistency – In fetchProductDetails.fulfilled, you're assigning to state.selectedProduct, but the initial state defines productDetails. This leads to an inconsistency in state usage.