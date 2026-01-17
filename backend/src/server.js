require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server / Postman / Render
    if (!origin) return callback(null, true);

    // localhost (dev)
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // ALL vercel deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // ❌ DO NOT ERROR — just deny silently
    return callback(null, false);
  },
  credentials: true
}));



/**
 * ✅ Express v5-safe preflight handler
 */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    cors(corsOptions)(req, res, next);
  } else {
    next();
  }
});

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
