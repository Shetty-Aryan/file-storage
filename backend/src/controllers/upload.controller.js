const fs = require("fs");
const path = require("path");
const { scanFile } = require("../services/scan.service");

exports.upload = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = req.file.path;

    // 🦠 SCAN FILE
    await scanFile(filePath);

    // continue encryption + storage logic here
    // encrypt → upload → delete temp file

    // ✅ async + safe cleanup
    fs.promises.unlink(filePath).catch(() => {});

    res.json({
      success: true,
      fileId: "generated-id"
    });

  } catch (err) {
    console.error("Upload error:", err.message);

    // ✅ safe cleanup if scan fails
    if (filePath && fs.existsSync(filePath)) {
      fs.promises.unlink(filePath).catch(() => {});
    }

    res.status(400).json({
      error: err.message || "File upload failed"
    });
  }
};
