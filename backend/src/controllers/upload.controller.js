const fs = require("fs");
const path = require("path");
const { scanFile } = require("../services/scan.service");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 🦠 SCAN FILE
    await scanFile(filePath);

    // continue encryption + storage logic here
    // encrypt → upload → delete temp file

    fs.unlinkSync(filePath);

    res.json({ success: true, fileId: "generated-id" });

  } catch (err) {
    console.error(err);

    // delete infected file
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({ error: err.message });
  }
};
