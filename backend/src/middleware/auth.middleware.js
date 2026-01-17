const { admin } = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ VERIFY FAILED:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
