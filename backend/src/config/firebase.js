const admin = require("firebase-admin");
const path = require("path");

let serviceAccount;

try {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.resolve(__dirname, "../../firebase-service-account.json");

  serviceAccount = require(path.resolve(serviceAccountPath));
} catch (err) {
  console.error("❌ Firebase service account file not found or invalid path");
  throw err;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "file-storage-d4382.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
