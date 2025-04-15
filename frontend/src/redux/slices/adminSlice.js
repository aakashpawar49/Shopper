import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Add a new user (admin)
export const addUser = createAsyncThunk(
    "admin/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update user info (admin)
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                { name, email, role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete a user (admin)
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // fixed typo here
                    },
                }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
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
                state.error = action.payload || action.error.message;
            })

            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user); // assuming backend returns { user: {...} }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })

            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload?.message || action.error.message;
            })

            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload?.message || action.error.message;
            });
    },
});

export default adminSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // fetch all users (admin only)
// export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
//     const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
//         {
//             headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
//         }
//     );
//     response.data;
// });

// // Add the create user session
// export const addUser = createAsyncThunk(
//     "admin/addUser",
//     async (userData, {rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//             `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
//              userData,
//             {
//                 headers:{ 
//                     Authorization: `Bearer ${localStorage.getItem("userToken")}` 
//                 },
//             }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     });

// // Update user info
// export const updateUser = createAsyncThunk(
//     "admin/updateUser",
//     async ({ id, name, email, role}) => {
//         const response = await axios.put(
//            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
//            { name, email, role },
//            {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("userToken")}`
//             }
//            }
//         );
//         response.data;
//     }
// );

// // DELETE a user
// export const deleteUser = createAsyncThunk(
//     "admin/deleteUser", async (id) => {
//         await axios.delete(
//             `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("userToolkit")}`
//                 },
//             }
//         );
//         return id;
// });

// const adminSlice = createSlice({
//     name: "admin",
//     initialState: {
//         users: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(fetchUsers.pending, (state) => {
//             state.loading = true;
//         })
//         .addCase(fetchUsers.fulfilled, (state, action) => {
//             state.loading = false;
//             state.users = action.payload;
//         })
//         .addCase(fetchUsers.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message;
//         })
//         .addCase(updateUser.fulfilled, (state, action) => {
//             const updatedUser = action.payload;
//             const userIndex = state.users.findIndex(
//                 (user) => user._id === updatedUser._id
//             );
//             if (userIndex !== -1) {
//                 state.users[userIndex] = updatedUser;
//             }
//         })
//         .addCase(deleteUser.fulfilled, (state, action) => {
//             state.users = state.users.filter((user) => user._id !== action.payload);
//         })
//         .addCase(addUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(addUser.pending, (state, action) => {
//             state.loading = false;
//             state.users.push(action.payload.user) // add a new user to the state 
//         })
//         .addCase(addUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload.message;
//         })
//     },
// });

// export default adminSlice.reducer;
