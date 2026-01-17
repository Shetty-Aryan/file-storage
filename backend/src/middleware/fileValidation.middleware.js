const path = require("path");
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
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls (legacy)

  // Word (NO macros)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];

const blockedExtensions = [
  ".exe", ".bat", ".cmd", ".sh", ".js",
  ".vbs", ".ps1", ".jar",
  ".docm", ".xlsm" // macro-enabled
];

module.exports = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (blockedExtensions.includes(ext)) {
    return res.status(400).json({
      error: "Macro-enabled or dangerous file blocked"
    });
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: "Unsupported file type"
    });
  }

  const expectedMime = mime.lookup(ext);
  if (expectedMime && expectedMime !== file.mimetype) {
    return res.status(400).json({
      error: "Extension and MIME mismatch"
    });
  }

  next();
};
