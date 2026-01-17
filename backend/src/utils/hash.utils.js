const crypto = require("crypto");

exports.sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};
