const crypto = require("crypto");
const fs = require("fs");
const prompt = require("prompt-sync")();
let input = prompt("Input:");

const privateKey = fs.readFileSync("private.pem", { encoding: "utf-8" });

const decryptedData = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(`${input}`, "base64")
);

console.log(decryptedData.toString("utf-8"))