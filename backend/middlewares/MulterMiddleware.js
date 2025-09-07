// middlewares/multer.js
import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "AstrapeAI", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({storage,limits:{fileSize:1024*1024*5}});

export default upload;
