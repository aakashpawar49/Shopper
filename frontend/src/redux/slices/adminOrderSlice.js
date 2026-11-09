import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Fetch all orders (admin only)
export const fetchAllOrders = createApiThunk(
    "adminOrders/fetchAllOrders",
    () => ({ url: "/api/admin/orders", requiresAuth: true }),
    (data) => (Array.isArray(data) ? data : [])
);

// Update an order's delivery status
export const updateOrderStatus = createApiThunk(
    "adminOrders/updateOrderStatus",
    ({ id, status }) => ({
        method: "put",
        url: `/api/admin/orders/${id}`,
        data: { status },
        requiresAuth: true,
    })
);

// Delete an order and return its ID
export const deleteOrder = createApiThunk(
    "adminOrders/deleteOrder",
    (id) => ({ method: "delete", url: `/api/admin/orders/${id}`, requiresAuth: true }),
    (_data, id) => id
);

const sumSales = (orders) => orders.reduce((total, order) => total + (order.totalPrice || 0), 0);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
                state.totalSales = sumSales(action.payload);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex((order) => order._id === action.payload._id);
                if (index !== -1) state.orders[index] = action.payload;
                state.totalSales = sumSales(state.orders);
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter((order) => order._id !== action.payload);
                state.totalOrders = state.orders.length;
                state.totalSales = sumSales(state.orders);
            });
    },
});

export default adminOrderSlice.reducer;
