require("dotenv").config({
  path:
    process.env.NODE_ENV === "production" ? "./.env.production" : "./.env.test",
});

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // Middleware for parsing JSON

app.get("/", (req, res) => {
  res.send("Welcome to Hispana CFC Backend!");
});

// Route to create a new user
app.post("/api/v1/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all users
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// connect to MongoDB
const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(3010, () =>
      console.log("Server running on port 3010 and connected to MongoDB")
    );
  })
  .catch((err) => console.log("Database connection failed", err));