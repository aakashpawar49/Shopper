import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

// Fetch all users (admin only)
export const fetchUsers = createApiThunk(
    "admin/fetchUsers",
    () => ({ url: "/api/admin/users", requiresAuth: true }),
    (data) => (Array.isArray(data) ? data : [])
);

// Create a user. The backend responds with { message, user }.
export const addUser = createApiThunk(
    "admin/addUser",
    (userData) => ({
        method: "post",
        url: "/api/admin/users",
        data: userData,
        requiresAuth: true,
    }),
    (data) => data.user
);

// Update a user's name, email or role. The backend responds with { message, user }.
export const updateUser = createApiThunk(
    "admin/updateUser",
    ({ id, name, email, role }) => ({
        method: "put",
        url: `/api/admin/users/${id}`,
        data: { name, email, role },
        requiresAuth: true,
    }),
    (data) => data.user
);

// Delete a user and return its ID
export const deleteUser = createApiThunk(
    "admin/deleteUser",
    (id) => ({ method: "delete", url: `/api/admin/users/${id}`, requiresAuth: true }),
    (_data, id) => id
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = rejectedMessage(action);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((user) => user._id === action.payload?._id);
                if (index !== -1) state.users[index] = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = rejectedMessage(action);
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = rejectedMessage(action);
            });
    },
});

export default adminSlice.reducer;
