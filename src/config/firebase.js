const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env variable not set");
}

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-project-id.appspot.com"
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };
