import crypto from "crypto";

const legacyKey = crypto.createHash("sha256").update("your-secret-key").digest();

function getCurrentKey() {
  const secret = process.env.FORM_LINK_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("FORM_LINK_SECRET must be configured with at least 32 characters.");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

export const encrypt = (text: string) => {
  const key = getCurrentKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  // Base64url keeps the token safe as a single path segment across browsers,
  // proxies, and Next.js route parameter decoding.
  return `v3_${Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url")}`;
};

export const decrypt = (token: string) => {
  // Some clients pass through the escaped form of old v2 links.
  if (token.includes("%")) {
    try {
      token = decodeURIComponent(token);
    } catch {
      throw new Error("Invalid form link.");
    }
  }

  if (token.startsWith("v3_")) {
    const payload = Buffer.from(token.slice(3), "base64url");
    if (payload.length < 30) throw new Error("Invalid form link.");
    const iv = payload.subarray(0, 12);
    const tag = payload.subarray(12, 28);
    const data = payload.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getCurrentKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  }

  const parts = token.split(":");
  if (parts[0] === "v2" && parts.length === 4) {
    const [, ivHex, tagHex, dataHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const data = Buffer.from(dataHex, "hex");
    if (iv.length !== 12 || tag.length !== 16 || data.length === 0) throw new Error("Invalid form link.");
    const decipher = crypto.createDecipheriv("aes-256-gcm", getCurrentKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  }

  // Existing shared links used AES-CBC with a fixed legacy key. Keep them valid
  // while all newly generated links use the configured authenticated format.
  if (parts.length !== 2) throw new Error("Invalid form link.");
  const [ivHex, dataHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  if (iv.length !== 16 || data.length === 0 || data.length % 16 !== 0) throw new Error("Invalid form link.");
  const decipher = crypto.createDecipheriv("aes-256-cbc", legacyKey, iv);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
};
