const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const CLAMAV_PATH = `"C:\\Program Files\\ClamAV\\clamscan.exe"`;

exports.scanFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `${CLAMAV_PATH} "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (stdout.includes("FOUND")) {
        fs.unlinkSync(filePath); // delete infected file
        return resolve({
          safe: false,
          details: stdout
        });
      }

      if (error && !stdout.includes("OK")) {
        return reject(error);
      }

      resolve({ safe: true });
    });
  });
};
