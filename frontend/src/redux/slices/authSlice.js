import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

const newGuestId = () => `guest_${Date.now()}`;

// Retrieve user info from localStorage if available
const loadUserFromStorage = () => {
    try {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

// Reuse the stored guest ID, or create and store a new one
const initialGuestId = localStorage.getItem("guestId") || newGuestId();
localStorage.setItem("guestId", initialGuestId);

// Persist the session returned by login/register and hand the user to the reducer
const persistSession = ({ user, token }) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("userToken", token);
    return user;
};

// Log in with email and password
export const loginUser = createApiThunk(
    "auth/loginUser",
    (credentials) => ({ method: "post", url: "/api/users/login", data: credentials }),
    persistSession
);

// Register a new account
export const registerUser = createApiThunk(
    "auth/registerUser",
    (userData) => ({ method: "post", url: "/api/users/register", data: userData }),
    persistSession
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: loadUserFromStorage(),
        guestId: initialGuestId,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = newGuestId();
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = newGuestId();
            localStorage.setItem("guestId", state.guestId);
        },
    },
    extraReducers: (builder) => {
        [loginUser, registerUser].forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = rejectedMessage(action);
                });
        });
    },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
