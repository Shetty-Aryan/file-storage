const fs = require("fs");

module.exports = async (req, res, next) => {
  try {
    const { fileTypeFromFile } = await import("file-type");

    const filePath = req.file.path;
    const type = await fileTypeFromFile(filePath);

    if (!type) {
      return res.status(400).json({ error: "Unable to detect file type" });
    }

    if (type.mime !== req.file.mimetype) {
      return res.status(400).json({
        error: "Magic byte mismatch – possible malicious file"
      });
    }

    next();
  } catch (err) {
    console.error("Magic check failed:", err);
    res.status(500).json({ error: "File inspection failed" });
  }
};
