const { db } = require("../config/firebase");

exports.listFiles = async (req, res) => {
  try {
    const userId = req.user.uid;

    const limit = parseInt(req.query.limit) || 10;
    const { Timestamp } = require("firebase-admin/firestore");

    const lastCreatedAt = req.query.cursor
      ? Timestamp.fromMillis(Number(req.query.cursor))
      : null;


    let query = db
      .collection("files")
      .where("owner", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (lastCreatedAt) {
      query = query.startAfter(lastCreatedAt);
    }

    const snapshot = await query.get();

    const files = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        fileId: data.fileId,
        name: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        createdAt: data.createdAt
      };
    });

    const nextCursor =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
            .data()
            .createdAt.toMillis()
        : null;

    return res.json({
      files,
      nextCursor
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to list files"
    });
  }
};