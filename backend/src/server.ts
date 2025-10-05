import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import vaultRoutes from "./routes/vault";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) => console.error("MongoDB connection error:", error));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
