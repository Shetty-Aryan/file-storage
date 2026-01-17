const fs = require("fs");
const { fileTypeFromBuffer } = require("file-type");

module.exports = async (req, res, next) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "No file to inspect" });
    }

    const filePath = req.file.path;

    // ✅ Read file safely (non-blocking)
    const buffer = await fs.promises.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    if (!type) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: "Unable to detect file type"
      });
    }

    // ❌ Magic byte mismatch
    if (type.mime !== req.file.mimetype) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: "Magic byte mismatch – possible malicious file"
      });
    }

    next();
  } catch (err) {
    console.error("Magic byte check failed:", err);

    // Cleanup on crash
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "File inspection failed"
    });
  }
};
