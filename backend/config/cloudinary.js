// config/cloudinary.js
import {v2 as cloudinary} from "cloudinary";

import dotenv from "dotenv";
dotenv.config(); // ensures env vars are loaded


if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("Cloudinary environment variables missing!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
