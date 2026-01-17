const admin = require("firebase-admin");

try {
  if (!process.env.FIREBASE_JSON_BASE64) {
    throw new Error("FIREBASE_JSON_BASE64 env variable not set");
  }

  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_JSON_BASE64, "base64").toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "file-storage-d4382.firebasestorage.app"
  });

  console.log("✅ Firebase initialized");
} catch (err) {
  console.error("❌ Firebase initialization failed:", err.message);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
