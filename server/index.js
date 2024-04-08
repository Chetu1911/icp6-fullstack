import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;


import cors from "cors";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("Database Connected");
};

connectDB();

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is Running",
    data: null,
  });
});

// ==============   All APIs here  =============

// Review Api

import Review from "./models/Review.js";

app.post("/review", async (req, res) => {
  const { name, message } = req.body;

  if (!name) {
    return res.json({
      success: false,
      message: "Name is required",
      data: null,
    });
  }

  if (!message) {
    return res.json({
      success: false,
      message: "Review is required",
      data: null,
    });
  }

  const newReview = await Review.create({
    name: name,
    message: message,
  });

  res.json({
    success: true,
    message: "Review added successfully",
    data: newReview,
  });
});
app.get("/review", async (req, res) => {
  const review = await Review.find();

  res.json({
    success: true,
    message: "Review featched successfully",
    data: review,
  });
});
app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;

  await Review.deleteOne({ _id: id });

  res.json({
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

// Login Api

import User from "./models/User.js"


app.post("/user", async (req, res) => {
  const { email, userName, userPhoto } = req.body; 

  try {
    
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      
      existingUser.isLoggedIn = true;
      await existingUser.save();

      res.json({
        success: true,
        message: "User logged in successfully",
        data: existingUser 
      });
    } else {
    
      const newUser = await User.create({
        email,
        userName,
        userPhoto,
        isLoggedIn: true
      });

      res.json({
        success: true,
        message: "New user created and logged in successfully",
        data: newUser 
      });
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});


app.get("/user", async (req, res) => {
  try {
    
    const users = await User.find();

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users 
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});


// Logout Api


app.post("/user/logout", async (req, res) => {
  const { email } = req.body; 

  try {
    
    let user = await User.findOne({ email });

    if (user) {
      
      user.isLoggedIn = false;
      await user.save();

      res.json({
        success: true,
        message: "User logged out successfully",
        data: user 
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null
      });
    }
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});

// Payment Api

import Payment from "./models/paymentpage_model.js";

app.post("/payment", async (req, res) => {
  const {
      First_Name,
      Last_Name,
      Date_of_Birth,
      Phone_Number,
      Email,
      City,
      Zip
  } = req.body;

  try {
      const newPayment = await Payment.create({
          First_Name: First_Name,
          Last_Name: Last_Name,
          Date_of_Birth: Date_of_Birth,
          Phone_Number: Phone_Number,
          Email: Email,
          City: City,
          Zip: Zip
      });

      res.status(201).json({
          message: "Payment created successfully",
          data: newPayment
      });
  } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});









app.listen(PORT, () => console.log(`Server running on port ${PORT}`));