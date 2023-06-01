import CryptoJS from "crypto-js";

class AesUtil {
  constructor(keySize: number, iterationCount: any) {
    keySize = keySize / 64;
//    iterationCount = iterationCount;
  }

  generateKey(salt: any, passPhrase: any) {
    var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt));
    return key;
  }
  encrypt(salt: any, iv: any, passPhrase: any, plainText: any) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(""),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  decrypt(salt: any, iv: any, passPhrase: any, cipherText: any) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText),
    });
    var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(""),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

export default AesUtil;
