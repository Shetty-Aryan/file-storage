require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/file.routes");


const app = express();

app.use(cors({
  origin:[ "http://localhost:3001",
    "https://file-storage-bslog7owt-shetty-aryans-projects.vercel.app/"], // Next.js dev server
  credentials: true
}));

app.use(express.json());

app.use("/backend/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
