import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import { createApiThunk, rejectedMessage } from "../../lib/api";

const emptyCart = () => ({ products: [] });

const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : emptyCart();
    } catch {
        return emptyCart();
    }
};

const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Load the cart for a user or guest. The backend answers 404 when no cart
// exists yet, which simply means the cart is empty.
export const fetchCart = createApiThunk(
    "cart/fetchCart",
    ({ userId, guestId }) => ({
        url: "/api/cart",
        params: { userId, guestId },
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    }),
    (data) => (Array.isArray(data?.products) ? data : emptyCart())
);

// Add a product to the cart for a user or guest
export const addToCart = createApiThunk(
    "cart/addToCart",
    ({ productId, quantity, size, color, guestId, userId }) => ({
        method: "post",
        url: "/api/cart",
        data: { productId, quantity, size, color, guestId, userId },
    })
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createApiThunk(
    "cart/updateCartItemQuantity",
    ({ productId, quantity, guestId, userId, size, color }) => ({
        method: "put",
        url: "/api/cart",
        data: { productId, quantity, guestId, userId, size, color },
    })
);

// Remove an item from the cart
export const removeFromCart = createApiThunk(
    "cart/removeFromCart",
    ({ productId, guestId, userId, size, color }) => ({
        method: "delete",
        url: "/api/cart",
        data: { productId, guestId, userId, size, color },
    })
);

// Merge the guest cart into the user's cart after login
export const mergeCart = createApiThunk(
    "cart/mergeCart",
    ({ guestId, user }) => ({
        method: "post",
        url: "/api/cart/merge",
        data: { guestId, user },
        requiresAuth: true,
    })
);

// Every cart request returns the whole updated cart
const cartThunks = [fetchCart, addToCart, updateCartItemQuantity, removeFromCart, mergeCart];

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = emptyCart();
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending(...cartThunks), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isFulfilled(...cartThunks), (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addMatcher(isRejected(...cartThunks), (state, action) => {
                state.loading = false;
                // fetchCart is a background sync on page load: if it fails, keep
                // the locally stored cart instead of showing an error.
                if (!fetchCart.rejected.match(action)) {
                    state.error = rejectedMessage(action);
                }
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
