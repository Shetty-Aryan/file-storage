const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

const allowedTypes = [
  // Documents
  "application/pdf",
  "text/plain",

  // Images
  "image/png",
  "image/jpeg",

  // CSV
  "text/csv",

  // Excel
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",

  // Word (NO macros)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const blockedExtensions = [
  ".exe", ".bat", ".cmd", ".sh",
  ".vbs", ".ps1", ".jar",
  ".docm", ".xlsm" // macro-enabled
];

module.exports = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const ext = path.extname(file.originalname).toLowerCase();

  // ❌ Block dangerous extensions
  if (blockedExtensions.includes(ext)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({
      error: "Dangerous or macro-enabled file blocked"
    });
  }

  // ❌ Block unsupported MIME
  if (!allowedTypes.includes(file.mimetype)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({
      error: "Unsupported file type"
    });
  }

  // ❌ Extension vs MIME mismatch
  const expectedMime = mime.lookup(ext);
  if (expectedMime && expectedMime !== file.mimetype) {
    fs.unlinkSync(file.path);
    return res.status(400).json({
      error: "File extension and MIME type mismatch"
    });
  }

  next();
};
