const { admin } = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    if (!admin) {
      console.error("❌ Firebase admin not initialized");
      return res.status(500).json({ error: "Auth service unavailable" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    // ✅ Trim token (important for cloud proxies)
    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = await admin.auth().verifyIdToken(token);

    // Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ VERIFY FAILED:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
