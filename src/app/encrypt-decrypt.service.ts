import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }

  decryptMessage(Message:any, Key:string, iv:string) {
    const key = CryptoJS.enc.Utf8.parse(Key);
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(
      Message,
      key,
      { iv: ivBytes, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}
