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
 * SINGLE CORS MIDDLEWARE (Express v5 SAFE)
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://file-storage-cju807os4-shetty-aryans-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server / Postman / health checks
    if (!origin) return callback(null, true);

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
 * IMPORTANT:
 * This line lets Express answer OPTIONS automatically
 * DO NOT add app.options("*")
 */
app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
