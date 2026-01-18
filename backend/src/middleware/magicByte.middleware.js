const fs = require("fs");
const FileType = require("file-type");

module.exports = async (req, res, next) => {
  try {
    const filePath = req.file.path;

    const buffer = fs.readFileSync(filePath);
    const type = await FileType.fromBuffer(buffer);

    if (!type) {
      return res.status(400).json({
        error: "Unable to detect file type"
      });
    }

    if (type.mime !== req.file.mimetype) {
      return res.status(400).json({
        error: "Magic byte mismatch – possible malicious file"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "File inspection failed"
    });
  }
};