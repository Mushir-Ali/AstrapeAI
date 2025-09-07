import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth',UserRoutes);

app.get("/",(req,res)=>{
    res.send("Backend running now !");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});