require("dotenv").config(); // 👈 ADD THIS AT THE TOP

const express = require("express");
const fileRoutes = require("./routes/file.routes");

const app = express();
app.use(express.json());

app.use("/api/files", fileRoutes);

// 👇 REPLACE hardcoded port with env-based port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
