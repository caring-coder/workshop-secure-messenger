# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 6 - Retrieving Messages from the Database

### Retrieving Messages

**👉 ACTION**: Add this code right after the `sendMessage()` method in `chat.tsx`:

```ts
  const addMessages = async (newMessages: Message[]) => {
    // Loop through each message
    for (const newMessage of newMessages) {
      // Add the message to the state, ignoring duplicates by ID
      setMessages((messages) => {
        if (messages.some((message) => message.id === newMessage.id)) {
          return messages;
        }
        return [...messages, newMessage];
       });
    }
  };

  useEffect(() => {
    // Load messages from the messages table in supabase
    const doLoadMessages = async () => {
      const messagesFromDB = await loadMessages();
      if (messagesFromDB) {
        addMessages(messagesFromDB);
      }
    };
    doLoadMessages();

    // Subscribe to table changes and receive updates in realtime
    const messageSubscription = subscribeToMessages((newMessages) => {
      addMessages(newMessages);
    });

    // Unsubscribe from the channel when the component unmounts
    return () => {
      messageSubscription.unsubscribe();
    };
  }, []);
```

**👉 ACTION**: Now write the `loadMessages()` and `subscribeToMessages()` methods to retrieve messages, and then subscribe to new messages in the database in real-time.

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to read from database in the `@/lib/supabase.ts` file. Feel free to import this into `chat.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: When using the chat, any message you send will show up after a short delay. This delay is the time it tkes the message to get into the database, be loaded back up, and decrypted.

### Done

You've reached the end of step 6 and should have a one-person chat working again.

---

[▶️ STEP 7: Making the Chat Multi-User](./STEP-7-MAKING-CHAT-MULTI-USER.md)

\_[🔙 Back to step 3: Encrypting Messages](./STEP-5-STORING-IN-DATABASE.md)

[ben-twitter]: https://twitter.com/bendechrai
