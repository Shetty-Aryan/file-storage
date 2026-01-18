const express = require("express");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/fileValidation.middleware");
const magicCheck = require("../middleware/magicByte.middleware");
const auth = require("../middleware/auth.middleware");

const uploadController = require("../controllers/upload.controller");
const downloadController = require("../controllers/download.controller");
const listController = require("../controllers/list.controller");
const deleteController = require("../controllers/delete.controller");

const {
  uploadLimiter,
  downloadLimiter,
  listLimiter,
  deleteLimiter
} = require("../middleware/ratelimit.middleware");

const router = express.Router();

// 🔐 UPLOAD (auth + rate limit)
router.post(
  "/upload",
  auth,
  uploadLimiter,
  upload.single("file"),
  validate,
  magicCheck,
  uploadController.upload
);

// 📂 LIST FILES
router.get(
  "/",
  auth,
  listLimiter,
  listController.listFiles
);

// 📥 DOWNLOAD
router.get(
  "/download/:fileId",
  auth,
  downloadLimiter,
  downloadController.download
);

// 🗑️ DELETE
router.delete(
  "/:fileId",
  auth,
  deleteLimiter,
  deleteController.deleteFile
);


module.exports = router;