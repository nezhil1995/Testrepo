import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  async encrypt(text: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combine IV and ciphertext for storage or transmission
    const encryptedData = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    encryptedData.set(iv);
    encryptedData.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64 for easy storage or transmission
    const base64Encoded = btoa(String.fromCharCode(...encryptedData));

    return base64Encoded;
  }

  async decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
    // Convert from base64
    const encryptedData = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));

    const iv = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);

    const decryptedArray = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedArray);

    return decryptedText;
  }

  async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
}

