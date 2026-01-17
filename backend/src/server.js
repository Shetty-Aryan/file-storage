require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

/**
 * REQUIRED for Render + rate-limit + X-Forwarded-For
 */
app.set("trust proxy", 1);

/**
 * CORS (dynamic + production-safe)
 */
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://file-storage-61w01c1ov-shetty-aryans-projects.vercel.app"
    ];

    // Allow server-to-server, Postman, Render health checks
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
 * 🔥 VERY IMPORTANT — preflight support
 */
app.options("*", cors());

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
