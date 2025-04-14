import CryptoJS from "crypto-js";

const SECRET_KEY = "9f6d7e1b2c3a8f4d0e5b6c7d8a9e2f3c"; // 32 chars
const IV = "MTIzNDU2Nzg5MDEy"; // 16 chars

// AES Encryption function
export function encryptAES(text) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

  // AES Encryption function for OTP
 export function decryptAES(text) {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8); 
  }