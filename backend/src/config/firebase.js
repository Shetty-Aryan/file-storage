const admin = require("firebase-admin");

let firebaseAppInitialized = false;

try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT env variable not set");
  } else {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, "\n")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "file-storage-d4382.firebasestorage.app"
    });

    firebaseAppInitialized = true;
    console.log("✅ Firebase Admin initialized");
  }
} catch (err) {
  console.error("❌ Firebase initialization failed:", err.message);
}

const db = firebaseAppInitialized ? admin.firestore() : null;
const bucket = firebaseAppInitialized ? admin.storage().bucket() : null;

module.exports = { admin: firebaseAppInitialized ? admin : null, db, bucket };
