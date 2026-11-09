// Load environment variables before any other module reads process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const paymentRoute = require("./routes/paymentRoute");

// Fail fast with a clear message when required configuration is missing
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(
        `Missing required environment variables: ${missingEnv.join(", ")}. ` +
            "Copy backend/.env.example to backend/.env and fill in the values."
    );
    process.exit(1);
}

const app = express();

// Parse query strings with Node's querystring module: no nested objects, so a
// value like ?gender[$ne]=x can't turn into a MongoDB operator.
app.set("query parser", "simple");

// Security headers. The API is called from another origin (the frontend), so
// allow cross-origin reads of its responses.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to Shopper API");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoutes);
app.use("/api/payment", paymentRoute);

// Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Unknown routes and errors (must come after all routes)
app.use(notFound);
app.use(errorHandler);

// Start an HTTP server only when run directly (`node server.js`, nodemon, Render).
// On Vercel the file is imported and the exported app is used as the handler.
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown: stop accepting connections, finish in-flight requests,
    // then close the database connection.
    const shutdown = (signal) => {
        console.log(`${signal} received, shutting down...`);
        server.close(async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
        // Force exit if open connections don't drain in time
        setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// Exported for serverless hosts (e.g. @vercel/node) that use the app as a handler
module.exports = app;
