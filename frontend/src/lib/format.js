// Formats a price for display, e.g. 1299.5 -> "₹1,299.5"
export const formatPrice = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// Formats a date (string or Date) for display, e.g. "9 Nov 2026"
export const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
