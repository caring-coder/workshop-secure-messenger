"use client";
import { Message } from "@/types/Message";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save a message to the database (strings are encrypted data)
 * @param sender string
 * @param message string
 */
export const saveMessage = async (sender: string, message: string) => {
  await supabase.from("messages").insert([{ sender, message }]);
};

/**
 * Load messages from the database (strings are encrypted data)
 * @returns Message[]
 */
export const loadMessages = async () => {
  const { data: messages } = await supabase.from("messages").select("*");
  return messages;
};

/**
 * Subscribe to new messages
 * @param callback (messages: Message[]) => void
 * @returns { onRemove: () => void }
 */
export const subscribeToMessages = (
  callback: (messages: Message[]) => void
) => {
  const messageSubscription = supabase
    .channel("table-db-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload: { new: Message }) => {
        // When a new message is inserted, update the messages state
        callback([payload.new]);
      }
    )
    .subscribe();
  return messageSubscription;
};

/**
 * Save a key to the database
 * @param publicKey CryptoKey
 * @returns void
 */
export const saveKey = async (publicKey: CryptoKey) => {
  const key = await window.crypto.subtle.exportKey("jwk", publicKey);
  await supabase.from("keys").insert([{ key }]);
};

/**
 * Get keys from the database
 * @returns CryptoKey[]
 */
export const loadKeys = async (): Promise<CryptoKey[]> => {
  const { data: results } = await supabase.from("keys").select("*");

  // Convert the keys to CryptoKey objects
  let keys = [];
  if (results) {
    for (const keyData of results) {
      const jwk =
        typeof keyData.key === "string" ? JSON.parse(keyData.key) : keyData.key;
      keys.push(
        await window.crypto.subtle.importKey(
          "jwk",
          jwk,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["encrypt"]
        )
      );
    }
  }
  return keys;
};