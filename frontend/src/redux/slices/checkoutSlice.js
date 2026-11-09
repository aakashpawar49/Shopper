import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Create a checkout session from the cart and shipping details
export const createCheckout = createApiThunk(
    "checkout/createCheckout",
    (checkoutData) => ({
        method: "post",
        url: "/api/checkout",
        data: checkoutData,
        requiresAuth: true,
    })
);

// Turn a paid checkout into an order
export const finalizeCheckout = createApiThunk(
    "checkout/finalizeCheckout",
    (checkoutId) => ({
        method: "post",
        url: `/api/checkout/${checkoutId}/finalize`,
        requiresAuth: true,
    })
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        checkoutId: null,
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
                state.checkoutId = action.payload._id;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(finalizeCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizeCheckout.fulfilled, (state) => {
                state.loading = false;
                state.checkout = null;
                state.checkoutId = null;
            })
            .addCase(finalizeCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            });
    },
});

export default checkoutSlice.reducer;
