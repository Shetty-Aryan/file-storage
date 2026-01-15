const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "file-storage-d4382.firebasestorage.app"
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };
