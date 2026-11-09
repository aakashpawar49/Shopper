import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Shared axios instance for every call to the backend.
//
// Pass `requiresAuth: true` in a request's config to attach the logged-in
// user's token. Public requests are sent without an Authorization header, so
// simple GETs don't trigger a CORS preflight request.
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
    if (config.requiresAuth) {
        const token = localStorage.getItem("userToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Turns any axios/network error into a readable message. The backend replies
// with `{ message }`, `{ error }` or a plain string depending on the route.
export const getErrorMessage = (error) => {
    const data = error?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    return data?.message || data?.error || error?.message || "Something went wrong";
};

// Message to store in state for a rejected thunk, or null when the request
// was aborted on purpose (component unmounted or a newer request replaced it).
export const rejectedMessage = (action) =>
    action.meta?.aborted ? null : action.payload?.message || action.error?.message;

// createAsyncThunk wrapper for plain API calls.
//   buildRequest(arg) returns an axios request config ({ method, url, data, params, requiresAuth }).
//   select(data, arg) maps the response body to the action payload (defaults to the body itself).
// The thunk's abort signal is forwarded to axios, so `promise.abort()` cancels the HTTP request.
export const createApiThunk = (type, buildRequest, select = (data) => data) =>
    createAsyncThunk(type, async (arg, { rejectWithValue, signal }) => {
        try {
            const { data } = await api.request({ ...buildRequest(arg), signal });
            return select(data, arg);
        } catch (error) {
            return rejectWithValue({ message: getErrorMessage(error), status: error.response?.status });
        }
    });

export default api;
