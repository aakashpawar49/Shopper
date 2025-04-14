import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {  // ✅ Fixed 'asybc' to 'async'
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // ✅ Wrapped key in quotes
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {  // ✅ Changed from .pending to .rejected
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkoutSlice.reducer;


// Incorrect Code
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async thunk to create a checkout session
// export const createCheckout = createAsyncThunk(
//     "checkout/createCheckout",
//     async (checkoutdata, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
//                 checkoutdata,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem(userToken)}`,
//                     },
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// const checkoutSlice = createSlice({
//     name: "checkout",
//     initialState: {
//         checkout: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(createCheckout.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(createCheckout.fulfilled, (state, action) => {
//             state.loading = false;
//             state.checkout = action.payload;
//         })
//         .addCase(createCheckout.pending, (state, action) => {
//             state.loading = false;
//             state.error = action.payload.message;
//         });
//     },
// });

// export default checkoutSlice.reducer;
