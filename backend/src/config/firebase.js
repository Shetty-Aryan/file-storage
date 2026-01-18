const admin = require("firebase-admin");


if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env variable not set");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "file-storage-d4382.firebasestorage.app"
});



const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };