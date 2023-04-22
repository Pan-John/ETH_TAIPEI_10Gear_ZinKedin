const crypto = require("crypto");
const fs = require("fs");


const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from("I've been worked at XX company.")
  );

const exportedPrivateKeyBuffer = privateKey.export({
  type: "pkcs1",
  format: "pem",
});

fs.writeFileSync("private.pem", exportedPrivateKeyBuffer, {
  encoding: "utf-8",
});
   
console.log(encryptedData.toString("base64"));

