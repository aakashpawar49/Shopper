import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Fetch the logged-in user's orders
export const fetchUserOrders = createApiThunk(
    "orders/fetchUserOrders",
    () => ({ url: "/api/orders/my-orders", requiresAuth: true }),
    (data) => (Array.isArray(data) ? data : [])
);

// Fetch a single order by ID
export const fetchOrderDetails = createApiThunk(
    "orders/fetchOrderDetails",
    (orderId) => ({ url: `/api/orders/${orderId}`, requiresAuth: true })
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.loading = false;
                state.error = rejectedMessage(action);
            });
    },
});

export default orderSlice.reducer;
