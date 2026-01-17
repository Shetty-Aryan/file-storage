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
 * CORS (Express v5 compatible)
 */
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://file-storage-61w01c1ov-shetty-aryans-projects.vercel.app"
    ];

    // Allow Postman, server-to-server, Render health checks
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/**
 * ✅ THIS replaces app.options("*", cors())
 * Works in Express v5
 */
app.use(cors());

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
