# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 4 - Decrypting Messages

We have already passed the private key into the `<Chat>` component, so now we just need to use that to decrypt all the messages in the `messages` array.

### Decrypt Messages

**👉 ACTION**: Create a local `<Message>` component in the `chat.tsx` file that renders each message, and the use this component in the chat response:

```ts
function Message({
  message,
  privateKey,
}: {
  message: Message;
  privateKey: CryptoKey;
}) {
  const [decryptedSender, setDecryptedSender] = useState<string>("");
  const [decryptedMessage, setDecryptedMessage] = useState<string>("");
  const [canDecrypt, setCanDecrypt] = useState(false);

  useEffect(() => {
    // Decrypt the sender and message
    const doDecryption = async () => {
      try {
        const decryptedSender = await decryptMessage(
          message.sender,
          privateKey
        );
        const decryptedMessage = await decryptMessage(
          message.message,
          privateKey
        );
        setDecryptedSender(decryptedSender);
        setDecryptedMessage(decryptedMessage);
        setCanDecrypt(true);
      } catch (error) {
        // Could not decrypt - `canDecrypt` will remain
        // false and this message won't be rendered
      }
    };
    doDecryption();
  }, [message, privateKey]);

  if (!canDecrypt) return false;

  return (
    <div>
      <strong>{decryptedSender}:</strong> {decryptedMessage}
    </div>
  );
}
```

```ts
<div key={message.id} className="message">
  <Message message={message} privateKey={privateKey} />
</div>
```

**👉 ACTION**: Now write the `decryptMessage()` method to decrypt the sender name and message.

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to encrypt something with a given public key in the `@/lib/crypto.ts` file. Feel free to import this into `page.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: When using the chat, the text should be readable again.

### Done

You've reached the end of step 4 and should have messages being decrypted before being shown in the chat output.

---

[▶️ STEP 5: Storing Messages in a Database](./STEP-5-STORING-IN-DATABASE.md)

\_[🔙 Back to step 3: Encrypting Messages](./STEP-3-DECRYPTING-MESSAGES.md)

[ben-twitter]: https://twitter.com/bendechrai
