const { bucket } = require("../config/firebase");

exports.uploadEncryptedFile = async (buffer, storagePath) => {
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    resumable: false,
    contentType: "application/octet-stream"
  });

  return storagePath;
};

exports.downloadEncryptedFile = async (storagePath) => {
  const file = bucket.file(storagePath);
  const [buffer] = await file.download();
  return buffer;
};


exports.deleteEncryptedFile = async (storagePath) => {
  const file = bucket.file(storagePath);
  await file.delete();
};