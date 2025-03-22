const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req,res) => {
    res.send("Welcome to Rabit API ")
});

app.listen(PORT, ()=> {
    console.log(`Server is running on https://localhost:${PORT}`);
});