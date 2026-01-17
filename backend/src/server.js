require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3001",
      "https://file-storage-bslog7owt-shetty-aryans-projects.vercel.app"
    ];

    // allow server-to-server / Postman / Render health checks
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

app.use(express.json());

app.use("/backend/files", fileRoutes);

/* ✅ health check (IMPORTANT for Render) */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
