// -------------------------------------------- //
// Imports
import userModel from "../models/UserModel.js";
import orderModel from "../models/OrderModel.js";
import { comparePassword, hashPassword } from "../tools/authPassword.js";
import JWT from "jsonwebtoken";

// -------------------------------------------- //
// Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, answer } = req.body;

    // Validations
    if (!username) {
      return res.send({
        message: "Username is required!",
      });
    }
    if (!email) {
      return res.send({
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.send({
        message: "Password is required!",
      });
    }
    if (!answer) {
      return res.send({
        message: "Answer is required!",
      });
    }

    // Check Availability
    const existingUser = await userModel.findOne({ email });
    const existingUsername = await userModel.findOne({ username });

    // Exisitng information
    if (existingUser || existingUsername) {
      return res.status(200).send({
        success: false,
        message: "User already registered.",
      });
    }

    // Register User
    const hashedPassword = await hashPassword(password);

    // Save User
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registration successful!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration!",
      error,
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password.",
      });
    }
    // Check User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered!",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password!",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login!",
      error,
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required!" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required!" });
    }
    // check
    const user = await userModel.findOne({ email });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong information!",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// Test
export const userVerify = (req, res) => {
  try {
    res.send("Protected Route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 characters long." });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        username: username || user.username,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(errror);
    res.status(400).send({
      success: false,
      message: "Error While Updated profile",
      error,
    });
  }
};

// Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
