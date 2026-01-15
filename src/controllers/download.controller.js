const { db } = require("../config/firebase");
const { downloadEncryptedFile } = require("../services/storage.service");
const { decryptBuffer } = require("../services/encrypt.service");

exports.download = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.uid; // will come from auth later

    // 1️⃣ Fetch metadata
    const doc = await db.collection("files").doc(fileId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileMeta = doc.data();

    // 2️⃣ Ownership check
    if (fileMeta.owner !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // 3️⃣ Download encrypted file
    const encryptedBuffer = await downloadEncryptedFile(
      fileMeta.storagePath
    );

    // 4️⃣ Decrypt
    const decryptedBuffer = decryptBuffer(
      encryptedBuffer,
      fileMeta.iv
    );

    // 5️⃣ IMPORTANT HEADERS
    res.setHeader("Content-Type", fileMeta.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileMeta.originalName}"`
    );
    res.setHeader("Content-Length", decryptedBuffer.length);
    const { logEvent } = require("../services/audit.service");

    await logEvent({
      userId,
      action: "DOWNLOAD",
      fileId,
      fileName: fileMeta.originalName,
      req
    });


    // 6️⃣ Send binary
    return res.end(decryptedBuffer);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "File download failed"
    });
  }
};
