import express from "express";
const router = express.Router();
import {protect} from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/MulterMiddleware.js";
import {isAdmin} from "../middlewares/AdminMiddleware.js"
import { createItem,getItem,getItems,updateItem,deleteItem } from "../controllers/ItemControllers.js";

router.post("/create",protect,isAdmin,upload.single("image"),createItem);
router.get("/get/:id",protect,getItem);
router.get("/get",protect,getItems);
router.put("/update/:id",protect,isAdmin,upload.single("image"),updateItem);
router.delete("/delete/:id",protect,isAdmin,deleteItem);

export default router;