# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 7 - Making the Chat Multi-User

Open the app in a different browser, or a private browser session. This will not work in another tab, as that tab will share the Indexed DB data.

> **💡 TIP**: If you're having problems connecting from another browser, double check you have the app running open to the public, as performed in the (Setting Up)[./STEP-1-SETTING-UP.md] section.

**🧪 CHECKPOINT**: Note that both users can use the chat, but they only see their own chats.

### Encrypting for Multiple Recipients

In a previous iteration of this workshop, we implemented Pretty Good Privacy's (PGP), which not only offered asymmetric encryption, but allowed one message to be encrypted with multiple public keys. This made it highly suitable for encrypting a payload and transmitting it once, that a specific person or group of people could read.

This workshop brings us up-to-date and makes use of the Web Crypto API that's included in major modern web browsers. The downside is that the current recommended encryption algorithm, RSA-OAEP (Optimal Asymmetric Encryption Padding) doesn't support multiple-key encryption.

In order to encrypt for multiple recipients in this app, we're going to need to store a message for each recipient. That is, if there are 3 people in the group (Alice, Bob, and Charlie), and one of them sends a message, they must encrypt it once for each recipient, and then save each of those three in the database.

This means that the number of messages stored will be greater than the number written by any users, but has the added advantage that it makes it harder to work out what's going on if someone gets access to all the ecrypted data.

### Sharing Public Keys

In order to encrypt for each recipient, the recipients will need to share their public keys with each other. The easiest way to do this is to save the public key someone public when it's generated.

**👉 ACTION**: Save the generated public key in the database when it's generated in `page.tsx`. Add this to the end of the `runKeyGeneration()` method:

```ts
    // Save the key to supabase
    await saveKey(publicKey);
```

**👉 ACTION**: Now write the `saveKey()` method to insert the public key into the keys table of the database. (See the [Supabase insert docs][supabase-insert].)

> **💡 TIP**: You'll need to export the public key to a JWK format that can be stored in the database using the following in your `saveKey()` method.
> ```ts
> await window.crypto.subtle.exportKey("jwk", publicKey);
> ```

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to save these to the database in the `@/lib/supabase.ts` file. Feel free to import this into `chat.tsx` and use as required.

> **⚠ LOOK OUT**: Note that there is a `saveKeypairs()` method in `idb.ts` for saving both keys to Indexed DB, and `saveKey()` in `supabase.ts` for saving the one public key to Supabase.

### Test the App

**👉 ACTION**: Navigate to the Application tab in your browser's developer tools, find the Indexed DB section, locate the three data items (`privateKey`, `publicKey`, and `sender`) and delete them. We're going to start each user from scratch so the `publicKey` is saved to Supabase after generation.

**🧪 CHECKPOINT**: When refreshing and providing a name, and generating keys, you will see the key show up in the `keys` table in Supabase.

### Encryption for Everyone

Now we just need to save the message to the database for every recipient.

**👉 ACTION**: Update the `sendMessage()` handler in `chat.ts` to loop through all the public keys and encrypt and save a message for each:

```ts
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const publicKey of await loadKeys()) {
        const encryptedSender = await encryptMessage(sender, publicKey);
        const encryptedMessage = await encryptMessage(message, publicKey);
        await saveMessage(encryptedSender, encryptedMessage);
    }
    setMessage("");
  };
```

**👉 ACTION**: Now write the `loadKeys()` method to get all the public keys from the keys table of the database. (See the [Supabase select docs][supabase-select].)

> **💡 TIP**: You'll need to import the public key from its JWK format so it can be used by the Web Crypto API.
> ```ts
> // For each key loaded from supabase
> const jwk = typeof key === "string" ? JSON.parse(key) : key;
> keys.push( await window.crypto.subtle.importKey(
>   "jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"] )
> );
> ```

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to save these to the database in the `@/lib/supabase.ts` file. Feel free to import this into `chat.tsx` and use as required.


If you want to, you could clean up the call to the `<Chat>` component, and the component API, to no longer require the user's publicKey, as it's not being used anymore. Leaving it as is won't stop the application from functioning though.

### Test the App

If you only deleted the Indexed DB entries in one of the browsers that you've been testing this app in, make sure you do that in the other browser too and that you have regenerated keys for both users since adding the code to save the public keys to the database. If you look at the keys table in Supabase, you should see at least two entries.

**🧪 CHECKPOINT**: When refreshing and providing a name, and generating keys, you will see the key show up in the `keys` table in Supabase.

### Done

🎉 You've done it! You should have a full working end-to-end encrypted chat app. Congratulations 🎉

---

_[🔙 Back to step 6: Retrieveing Messages from the Database](./STEP-6-RETRIEVING-FROM-DATABASE.md)_

[ben-twitter]: https://twitter.com/bendechrai
[supabase-insert]: https://supabase.com/docs/reference/javascript/insert
[supabase-select]: https://supabase.com/docs/reference/javascript/select
