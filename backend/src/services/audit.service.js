const { db } = require("../config/firebase");

exports.logEvent = async ({
  userId,
  action,
  fileId = null,
  fileName = null,
  req
}) => {
  try {
    await db.collection("audit_logs").add({
      userId:req.user.uid,
      action,
      fileId,
      fileName,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};