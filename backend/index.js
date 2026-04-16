import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/users.routes.js"

import cors from 'cors'

dotenv.config();

const app = express();

const BASE_URL = process.env.FRONTEND_URL

app.use(cors({
  origin: BASE_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);

app.use("/api/profile",userRoutes);

const PORT = process.env.PORT || 980;

connectDB();

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
