const crypto = require("crypto");

const ALGO = "aes-256-cbc";

// In production, load MASTER_KEY from env or KMS
const MASTER_KEY = crypto
  .createHash("sha256")
  .update(process.env.MASTER_KEY || "dev-master-key")
  .digest(); // 32 bytes

exports.encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, MASTER_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return {
    encrypted,
    iv: iv.toString("hex"),
    algorithm: ALGO
  };
};

exports.decryptBuffer = (encrypted, ivHex) => {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, MASTER_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};
