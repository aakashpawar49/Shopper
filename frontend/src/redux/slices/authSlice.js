import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Check for an existing guest ID in the local storage or create a new one
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;

// Set guestId in localStorage only if it's a new guest
if (!localStorage.getItem("guestId")) {
    localStorage.setItem("guestId", initialGuestId);
}

// Initial State
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            });
    },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;





// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Retrieve user info and token from localStorage if available
// const userFromStorage = localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null;

// // Check for an existing guest ID in the local storage
// const initialGuestId =
//     localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
// localStorage.setItem("guestId", initialGuestId);

// // Initial State
// const initialState = {
//     user: userFromStorage,
//     guestId: initialGuestId,
//     loading: false,
//     error: null,
// };

// // Async Thunk for User Login
// export const loginUser = createAsyncThunk(
//     "auth/loginUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
//                 userData
//             );
//             localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//             localStorage.setItem("userToken", response.data.token);

//             return response.data.user;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// // Async Thunk for User Registration
// export const registerUser = createAsyncThunk(
//     "auth/registerUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
//                 userData
//             );
//             localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//             localStorage.setItem("userToken", response.data.token);

//             return response.data.user;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// // Slice
// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         logout: (state) => {
//             state.user = null;
//             state.guestId = `guest_${new Date().getTime()}`;
//             localStorage.removeItem("userInfo");
//             localStorage.removeItem("userToken");
//             localStorage.setItem("guestId", state.guestId);
//         },
//         generateNewGuestId: (state) => {
//             state.guestId = `guest_${new Date().getTime()}`;
//             localStorage.setItem("guestId", state.guestId);
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || action.error.message;
//             })
//             .addCase(registerUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(registerUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload;
//             })
//             .addCase(registerUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || action.error.message;
//             });
//     },
// });

// export const { logout, generateNewGuestId } = authSlice.actions;
// export default authSlice.reducer;



// OLD CODE
// ERROR
//Logical Error – In loginUser.fulfilled and registerUser.fulfilled, you are setting state.error = action.payload instead of setting state.user = action.payload. This overwrites the error state incorrectly.
//Typo – intialGuestId should be initialGuestId (consistency; not technically a syntax error, but could be misleading or confusing).

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Retrieve user info and token from localStorage if available
// const userFromStorage = localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null;

// // Check for an existing guest ID in the local storage
// const intialGuestId = 
//     localStorage.getItem("guestId") ||  guest_${new Date().getTime()};
// localStorage.setItem("guestId", intialGuestId);

// // Initial State
// const initialState = {
//     user: userFromStorage,
//     guestId: intialGuestId,
//     loading: false,
//     error: null,
// };

// // Async Thunk for User Login
// export const loginUser = createAsyncThunk(
//     "auth/loginUser",
//     async(userData, {rejectWithValue}) => {
//     try {
//         const response = await axios.post(
//             ${import.meta.env.VITE_BACKEND_URL}/api/users/login, 
//             userData
//         );
//         localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//         localStorage.setItem("userToken", response.data.token);

//         return response.data.user; // Return the user object from the response
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
//   } 
// );

// // Async Thunk for User Registration
// export const registerUser = createAsyncThunk(
//     "auth/registerUser", 
//     async(userData, {rejectWithValue}) => {
//     try {
//         const response = await axios.post(
//             ${import.meta.env.VITE_BACKEND_URL}/api/users/register, 
//             userData
//         );
//         localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//         localStorage.setItem("userToken", response.data.token);

//         return response.data.user; // Return the user object from the response
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
//   } 
// );

// // Slice
// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         logout: (state) => {
//             state.user = null;
//             state.guestId = guest_${new Date().getTime()}; // Reset guest ID on logout
//             localStorage.removeItem("userInfo");
//             localStorage.removeItem("userToken");
//             localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
//         },
//         generateNewGuestId: (state) => {
//             state.guestId = guest_${new Date().getTime()};
//             localStorage.setItem("guestId", state.guestId);
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//         .addCase(loginUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(loginUser.fulfilled, (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         })
//         .addCase(loginUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload.message;
//         })
//         .addCase(registerUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(registerUser.fulfilled, (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         })
//         .addCase(registerUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload.message;
//         });
//     },
// });

// export const {logout, generateNewGuestId} = authSlice.actions;
// export default authSlice.reducer;