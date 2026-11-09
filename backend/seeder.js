const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");
const cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// Function to seed data

const seedData = async () => {
    // Connect to MongoDB (exits with a clear message if the connection fails)
    await connectDB();

    try{
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await cart.deleteMany();

        // Create a default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin",
        });

        // Assign the default user ID to each product
        const userID = createdUser.id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID };
        });

        // Insert the products into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully ")
        process.exit();
    } catch (error) {
        console.error("Error seeding the data : ", error);
        process.exit(1);
    }
};

seedData();