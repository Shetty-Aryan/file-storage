require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

/**
 * REQUIRED for Render + rate-limit
 */
app.set("trust proxy", 1);

/**
 * SINGLE, CORRECT CORS CONFIG
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://file-storage-h1asay66u-shetty-aryans-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / Render

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * Express will auto-handle OPTIONS
 */
app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
