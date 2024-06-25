"use client";
import { openDB, IDBPDatabase } from "idb";
import { cryptoKeyToJwk, jwkToCryptoKey } from "./crypto";

let dbPromise: Promise<IDBPDatabase>;
/**
 * Opens an indexedDB database connection once and returns the instance
 * @returns The database instance
 */
async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB("secure-messenger", 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys");
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Save the sender name to the database
 * @param sender The sender name to save to the database
 */
export async function saveSender(sender: string) {
  const db = await getDb();
  try {
    await db.put("keys", sender, "sender");
  } catch (error) {
    console.error("Failed to save sender:", error);
  }
}

/**
 * Load the sender name from the database
 * @returns The sender name
 */
export async function loadSender() {
  const db = await getDb();
  try {
    const sender = await db.get("keys", "sender");
    return sender;
  } catch (error) {
    console.error("Failed to load sender:", error);
    return null;
  }
}

/**
 * Save the user's public and private keys to the database
 * @param publicKey The public key to save
 * @param privateKey The private key to save
 */
export async function saveKeypairs(publicKey: CryptoKey, privateKey: CryptoKey) {
  const db = await getDb();

  try {
    const publicKeyJwk = await cryptoKeyToJwk(publicKey);
    const privateKeyJwk = await cryptoKeyToJwk(privateKey);

    await db.put("keys", publicKeyJwk, "publicKey");
    await db.put("keys", privateKeyJwk, "privateKey");
  } catch (error) {
    console.error("Failed to save keys:", error);
  }
}

/**
 * Loads the user's public and private keys from the database
 * @returns The public and private keys
 */
export async function loadKeypairs(): Promise<{
  publicKey: CryptoKey;
  privateKey: CryptoKey;
} | null> {
  const db = await getDb();

  try {
    // Try and get the keys from the db
    const publicKeyJwk = await db.get("keys", "publicKey");
    const privateKeyJwk = await db.get("keys", "privateKey");

    // If one exists and the other doesn't, throw an error
    if (!publicKeyJwk && privateKeyJwk) {
      throw new Error(
        "Private key found without a public key. This should never happen."
      );
    }
    if (publicKeyJwk && !privateKeyJwk) {
      throw new Error(
        "Public key found without a private key. This should never happen."
      );
    }

    // If both exist -- import them, and return them
    if (publicKeyJwk && privateKeyJwk) {
      const publicKey = await jwkToCryptoKey(publicKeyJwk, "encrypt");
      const privateKey = await jwkToCryptoKey(privateKeyJwk, "decrypt");
      return { publicKey, privateKey };
    }
  } catch (error) {
    console.error("Failed to load keys:", error);
  }

  return null;
}
