const { db } = require("../config/firebase");
const { deleteEncryptedFile } = require("../services/storage.service");
const { logEvent } = require("../services/audit.service");


exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.uid;

    // 1️⃣ Fetch metadata
    const docRef = db.collection("files").doc(fileId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileMeta = doc.data();

    // 2️⃣ Ownership check
    if (fileMeta.owner !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // 3️⃣ Delete encrypted file from storage
    await deleteEncryptedFile(fileMeta.storagePath);

    // 4️⃣ Delete metadata
    await docRef.delete();

    await logEvent({
        userId,
        action: "DELETE",
        fileId,
        fileName: fileMeta.originalName,
        req
    });


    return res.json({
      message: "File deleted securely 🗑️"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "File deletion failed"
    });
  }
};
