import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || "Unknown error occurred");
        }
    }
);

// Async thunk to finalize a checkout session
export const finalizeCheckout = createAsyncThunk(
    "checkout/finalizeCheckout",
    async (checkoutId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || "Unknown error occurred");
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
        checkoutId: null, // Track the checkout session ID
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
                state.checkoutId = action.payload._id; // Save the checkout ID for further use
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "An error occurred";
            })
            .addCase(finalizeCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizeCheckout.fulfilled, (state) => {
                state.loading = false;
                state.checkout = null; // Reset after finalizing
                state.checkoutId = null; // Clear checkoutId after finalizing
            })
            .addCase(finalizeCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "An error occurred";
            });
    },
});

export default checkoutSlice.reducer;
