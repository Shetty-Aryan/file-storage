const { spawn } = require("child_process");
const path = require("path");

const CLAMSCAN_PATH = process.env.CLAMSCAN_PATH || "clamscan";

exports.scanFile = (filePath) => {
  return new Promise((resolve, reject) => {
    console.log("🦠 Starting ClamAV scan:", filePath);

    const scan = spawn(CLAMSCAN_PATH, [
      "--no-summary",
      "--infected",
      filePath
    ]);

    let infected = false;

    scan.stdout.on("data", (data) => {
      const output = data.toString();
      console.log("ClamAV:", output);
      if (output.includes("FOUND")) {
        infected = true;
      }
    });

    scan.stderr.on("data", (data) => {
      console.error("ClamAV error:", data.toString());
    });

    scan.on("error", (err) => {
      console.error("❌ ClamAV spawn failed:", err);
      reject(new Error("ClamAV failed to start"));
    });

    scan.on("close", (code) => {
      console.log("🦠 ClamAV finished with code:", code);

      if (infected) {
        reject(new Error("Virus detected"));
      } else {
        resolve(true);
      }
    });
  });
};
