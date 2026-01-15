const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { sha256 } = require("../utils/hash.utils");
const { encryptBuffer } = require("../services/encrypt.service");
const { scanFile } = require("../services/scan.service");
const { uploadEncryptedFile } = require("../services/storage.service");
const { db } = require("../config/firebase");

exports.upload = async (req, res) => {
  try {
    // 1️⃣ Malware scan
    const scanResult = await scanFile(req.file.path);
    if (!scanResult.safe) {
      return res.status(400).json({ error: "Malware detected" });
    }

    // 2️⃣ Read file
    const buffer = fs.readFileSync(req.file.path);

    const { logEvent } = require("../services/audit.service");

    // 3️⃣ Hash
    const hash = sha256(buffer);

    // 4️⃣ Encrypt
    const { encrypted, iv, algorithm } = encryptBuffer(buffer);

    // 5️⃣ Cleanup temp file
    fs.unlinkSync(req.file.path);

    // 6️⃣ Prepare storage
    const fileId = uuidv4();
    const userId = req.user.uid; // will come from auth later
    const storagePath = `${userId}/${fileId}.enc`;

    // 7️⃣ Upload encrypted file
    await uploadEncryptedFile(encrypted, storagePath);

    // 8️⃣ Save metadata
    await db.collection("files").doc(fileId).set({
      fileId,
      owner: userId,
      originalName: req.file.originalname,
      storagePath,
      mimeType: req.file.mimetype,
      hash,
      iv,
      algorithm,
      size: req.file.size,
      createdAt: new Date()
    });
    

    // after Firestore metadata save
    await logEvent({
      userId,
      action: "UPLOAD",
      fileId,
      fileName: req.file.originalname,
      req
    });


    return res.json({
      message: "File securely stored ✅",
      fileId
    });

  } catch (err) {
    await logEvent({
      userId,
      action: "FAILED_UPLOAD",
      fileName: req.file.originalname,
      req
    });

    console.error(err);
    return res.status(500).json({
      error: "File storage failed"
    });
  }
  
};

