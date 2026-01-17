require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

/**
 * Required for Render / proxies
 */
app.set("trust proxy", 1);

/**
 * ✅ SIMPLE + SAFE CORS (NO credentials)
 * This works with Vercel, localhost, Postman, browser
 */
app.use(cors({
  origin: true, // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * Body parser
 */
app.use(express.json());

/**
 * Routes
 * YES — /backend is REQUIRED (your frontend expects it)
 */
app.use("/backend/files", fileRoutes);

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
