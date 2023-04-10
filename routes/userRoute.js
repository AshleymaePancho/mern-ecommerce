// -------------------------------------------- //
// Imports
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authUser.js";
import {
  registerUser,
  loginUser,
  userVerify,
  forgotPassword,
  updateProfile,
  getOrders,
  getAllOrders,
  orderStatus,
} from "../controllers/userController.js";

// -------------------------------------------- //
// Router Object
const router = express.Router();

// -------------------------------------------- //
// Routing

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forget Password
router.post("/forgot-password", forgotPassword);

// Test
router.get("/test", requireSignIn, isAdmin, userVerify);

// Protect User
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protect Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update Profile
router.put("/profile", requireSignIn, updateProfile);

// Orders
router.get("/orders", requireSignIn, getOrders);

// All Orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrders);

// Order Status
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatus);

export default router;
