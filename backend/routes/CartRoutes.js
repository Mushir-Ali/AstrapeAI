import express from "express";
import { addToCart, getCart, removeCartItem, updateCart, deleteCart } from "../controllers/CartControllers.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/get", protect, getCart);
router.delete("/remove/:itemId", protect, removeCartItem);
router.patch("/update", protect, updateCart);
router.delete("/delete", protect, deleteCart);

export default router;