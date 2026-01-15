const { db } = require("./config/firebase");

(async () => {
  await db.collection("test").add({
    status: "firebase connected",
    time: new Date()
  });
  console.log("Firestore connected successfully");
})();
