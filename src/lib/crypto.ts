/**
 * Generate a new RSA key pair
 * @returns The public and private keys
 */
export const generateKeys = async (): Promise<{
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}> => {
  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return { publicKey, privateKey };
};

/**
 * Convert a JWK to a CryptoKey
 * @param jwk
 * @param usage
 * @returns The CryptoKey
 */
export const jwkToCryptoKey = async (
  jwk: JsonWebKey,
  usage: KeyUsage
): Promise<CryptoKey> => {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    [usage]
  );
};

/**
 * Convert a CryptoKey to a JWK
 * @param key
 * @returns The JWK
 */
export const cryptoKeyToJwk = async (key: CryptoKey): Promise<JsonWebKey> => {
  return await window.crypto.subtle.exportKey("jwk", key);
};

/**
 * Encrypt a message
 * @param message The message to encrypt
 * @param publicKey The public key to encrypt the message with
 * @returns The encrypted message
 */
export async function encryptMessage(message: string, publicKey: CryptoKey) {
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encodedMessage
  );
  let uint8Array = new Uint8Array(encryptedMessage);
  let binaryString = uint8Array.reduce(
    (previous, current) => previous + String.fromCharCode(current),
    ""
  );
  return btoa(binaryString);
}

/**
 * Decrypt a message
 * @param message The message to decrypt
 * @param privateKey The private key to decrypt the message with
 * @returns The decrypted message
 */
export async function decryptMessage(message: string, privateKey: CryptoKey) {
  const binaryString = atob(message);
  const bytes = new Uint8Array(
    binaryString.split("").map((char) => char.charCodeAt(0))
  );
  const decryptedMessage = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    bytes
  );
  const encodedMessage = new TextDecoder().decode(decryptedMessage);
  return encodedMessage;
}
