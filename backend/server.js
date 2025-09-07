import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Backend running now !");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});