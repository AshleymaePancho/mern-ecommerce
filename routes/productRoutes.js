import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authUser.js";
import {
  productPayment,
  paymentToken,
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  productCategory,
  productCount,
  productFilters,
  productList,
  productPhoto,
  relatedProducts,
  searchProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Create
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct
);

// Update
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProduct
);

// Get Products
router.get("/get-products", getProducts);

// Get Single Product
router.get("/get-product/:slug", getSingleProduct);

// Get Photo
router.get("/product-photo/:pid", productPhoto);

// Delete Product
router.delete("/delete-product/:pid", deleteProduct);

// Filter Products
router.post("/product-filters", productFilters);

// Product Count
router.get("/product-count", productCount);

// Product Per Page
router.get("/product-list/:page", productList);

// Search Product
router.get("/search/:keyword", searchProduct);

// Similar Product
router.get("/related-products/:pid/:cid", relatedProducts);

// Product Category
router.get("/product-category/:slug", productCategory);

// Payment Routes
// Token
router.get("/braintree/token", paymentToken);

// Payment
router.post("/braintree/payment", requireSignIn, productPayment);

export default router;
