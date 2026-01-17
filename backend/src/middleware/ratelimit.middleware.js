const rateLimit = require("express-rate-limit");

// 🚨 Heavy operations (upload)
exports.uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: "Too many upload attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 📥 Downloads
exports.downloadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    error: "Too many download requests. Slow down."
  }
});

// 📂 File listing
exports.listLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    error: "Too many requests."
  }
});

// 🗑️ Deletion
exports.deleteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many delete requests."
  }
});
