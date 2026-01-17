require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

/**
 * REQUIRED for Render + express-rate-limit
 */
app.set("trust proxy", 1);

/**
 * CORS – credentials ENABLED
 */
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://file-storage-61w01c1ov-shetty-aryans-projects.vercel.app"
      ];

      // allow Postman / server-to-server / Render health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

/**
 * IMPORTANT: handle preflight correctly (Express v5 safe)
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
