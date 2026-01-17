const { spawn } = require("child_process");
const fs = require("fs");

const CLAMSCAN_PATH = process.env.CLAMSCAN_PATH || "clamscan";

exports.scanFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // ⛔ If file vanished (edge case)
    if (!fs.existsSync(filePath)) {
      return reject(new Error("File not found for scanning"));
    }

    console.log("🦠 Starting ClamAV scan:", filePath);

    const scan = spawn(CLAMSCAN_PATH, [
      "--no-summary",
      "--infected",
      filePath
    ]);

    let stderrOutput = "";

    scan.stderr.on("data", (data) => {
      stderrOutput += data.toString();
    });

    scan.on("error", (err) => {
      console.error("❌ ClamAV spawn failed:", err.message);
      reject(new Error("ClamAV not available in environment"));
    });

    scan.on("close", (code) => {
      console.log("🦠 ClamAV exited with code:", code);

      /*
        Exit codes:
        0 → clean
        1 → infected
        2 → error
      */

      if (code === 0) {
        return resolve(true);
      }

      if (code === 1) {
        return reject(new Error("Virus detected"));
      }

      console.error("❌ ClamAV error output:", stderrOutput);
      reject(new Error("ClamAV scan failed"));
    });
  });
};
