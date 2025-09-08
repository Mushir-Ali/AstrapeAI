import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";
import ItemRoutes from "./routes/ItemRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth',UserRoutes);
app.use('/api/items',ItemRoutes);
app.use('/api/cart',CartRoutes);

app.get("/",(req,res)=>{
    res.send("Backend running now !");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});