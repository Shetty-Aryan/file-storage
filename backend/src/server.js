require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file.routes");

const app = express();

/**
 * Required for Render
 */
app.set("trust proxy", 1);

/**
 * ✅ Allow ALL origins (safe for dev/demo)
 * ✅ Express v5 compatible
 * ✅ Handles OPTIONS automatically
 */
app.use(cors({
  origin: true, // reflect request origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
