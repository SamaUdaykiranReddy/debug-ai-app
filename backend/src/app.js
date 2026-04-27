import "./env.js"; // must be first — loads dotenv before any other imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "../routes/userRoutes.js";
import debugRoutes from "../routes/debugRoutes.js";
import rateLimit from "express-rate-limit";

const app = express();

// CORS — must be before all routes and other middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://18.232.181.249:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
// Fix for Express v5: use "/{*path}" instead of "*" for preflight
app.options("/{*path}", cors(corsOptions));

app.use(express.json());

// Rate limiter (only for debug routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/debugs", limiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/debugs", debugRoutes);

// Health check (for Docker + AWS)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

// Start server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});
