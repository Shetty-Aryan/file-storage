const { spawn } = require("child_process");
const fs = require("fs");

const CLAMAV_PATH = "C:\\Program Files\\ClamAV\\clamscan.exe";

exports.scanFile = (filePath) => {
  return new Promise((resolve, reject) => {
    console.log("🦠 Starting ClamAV scan (spawn)...");

    const scan = spawn(CLAMAV_PATH, [filePath], {
      windowsHide: true
    });

    let output = "";
    let errorOutput = "";

    scan.stdout.on("data", (data) => {
      output += data.toString();
    });

    scan.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    scan.on("error", (err) => {
      console.error("❌ ClamAV spawn error:", err);
      reject(new Error("Failed to start ClamAV"));
    });

    scan.on("close", (code) => {
      console.log("🦠 ClamAV scan finished with code:", code);

      // Malware detected
      if (output.includes("FOUND")) {
        try {
          fs.unlinkSync(filePath);
        } catch (_) {}

        return resolve({
          safe: false,
          details: output
        });
      }

      // Non-zero exit but no malware
      if (code !== 0 && !output.includes("OK")) {
        console.error("❌ ClamAV error output:", errorOutput);
        return reject(new Error("Malware scan failed"));
      }

      // Clean file
      return resolve({ safe: true });
    });
  });
};