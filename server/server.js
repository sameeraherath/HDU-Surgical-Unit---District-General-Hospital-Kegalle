import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import { connectMySql } from "./config/mysqlDB.js";

connectMySql();

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);

app.listen(PORT, () => {
  // Server started silently
});
