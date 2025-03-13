import crypto from "crypto";

const algorithm = "aes-256-cbc";

// The secret key must be 32 bytes long
const secretKey = crypto
  .createHash("sha256")
  .update("your-secret-key")
  .digest("base64")
  .substring(0, 32);
const iv = crypto.randomBytes(16); // Generate a random IV

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (encryptedText: string) => {
  const [ivString, encryptedData] = encryptedText.split(":");
  const ivBuffer = Buffer.from(ivString, "hex");
  const encryptedBuffer = Buffer.from(encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
