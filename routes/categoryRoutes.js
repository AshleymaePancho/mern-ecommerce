import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authUser.js";
import {
  allCategories,
  createCategory,
  deleteCategory,
  singleCategory,
  updateCategory,
} from "./../controllers/categoryController.js";

const router = express.Router();

// Routes
// Create Category
router.post("/create-category", requireSignIn, isAdmin, createCategory);

// Update Category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);

// Get All Categories
router.get("/get-categories", allCategories);

// Get Single Category
router.get("/single-category/:slug", singleCategory);

// Delete Category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

export default router;
