const crypto = require("crypto");
const { db, bucket } = require("../config/firebase");

exports.download = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.uid;

    // 1️⃣ Fetch metadata
    const snap = await db
      .collection("files")
      .where("fileId", "==", fileId)
      .where("owner", "==", userId)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileMeta = snap.docs[0].data();

    // 2️⃣ Prepare decrypt stream
    const decipher = crypto.createDecipheriv(
      fileMeta.algorithm,
      Buffer.from(process.env.MASTER_KEY,"utf8"),
      Buffer.from(fileMeta.iv, "hex")
    );

    // 3️⃣ Fetch encrypted file from storage
    const file = bucket.file(fileMeta.storagePath);
    const readStream = file.createReadStream();

    // 4️⃣ Response headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileMeta.originalName}"`
    );
    res.setHeader("Content-Type", fileMeta.mimeType);

    // 5️⃣ Stream: Storage → Decrypt → Response
    readStream.pipe(decipher).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
};