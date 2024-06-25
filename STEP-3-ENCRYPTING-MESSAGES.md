# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 3 - Encrypting Messages

### Passing Keys to `<Chat>`

In order to encrypt and decrypt messages, the `<Chat>` component will need both keys.

**👉 ACTION**: Change the `<Chat>` call in `page.tsx`:

```ts
  return <Chat sender={sender} publicKey={publicKey} privateKey={privateKey} />;
```

**👉 ACTION**: Change the `Chat` function signature to expect `publicKey` and `privateKey` too.

> **💡 TIP**: The type definition for the input parameters looks like this:
> ```ts
> {
>    sender: string;
>    publicKey: CryptoKey;
>    privateKey: CryptoKey;
> }
> ```

### Encrypt Messages

Now that `<Chat>` has the public and private keys, we can encrypt the message. For better privacy, we'll encrypt the sender name too.

**👉 ACTION**: Modify the `sendMessage()` function in `chat.tsx` so that it encrypts the `sender` and `message` before adding them to the state with `setMessages`:

```ts
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const encryptedSender = await encryptMessage(sender, publicKey);
    const encryptedMessage = await encryptMessage(message, publicKey);
    setMessages((messages) => [
      ...messages,
      { id: messages.length.toString(), sender: encryptedSender, message: encryptedMessage },
    ]);
    setMessage("");
  };
```

**👉 ACTION**: Now write the `encryptMessage()` method to retrieve them from Indexed DB.

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to encrypt something with a given public key in the `@/lib/crypto.ts` file. Feel free to import this into `page.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: Next time you send a message, you should see a jumbled mess of letters instead of your name and message.

### Done

You've reached the end of step 3 and should have messages being encrypted before being added to the chat messages array.

---

[▶️ STEP 4: Decrypting Messages](./STEP-4-DECRYPTING-MESSAGES.md)

_[🔙 Back to step 2: Generating Keys](./STEP-2-GENERATING-KEYS)

[ben-twitter]: https://twitter.com/bendechrai