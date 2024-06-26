# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 5 - Storing Messages in a Database

Now that we have message encryption and decryption, we can store the data in a database with less concern for privacy and security. We're going to use Supabase for this, but any database will do the job.

Supabase does support real-time sync, which means we can subscribe to changes. This will mean that any client showing the chats will get a real time update whenever any messages are added to the database, from any other user.

### Configuration

**👉 ACTION**: [Create a Supabase account](https://supabase.com/) and new [database](https://supabase.com/dashboard/new), and run this SQL to create your table:

```sql
create table messages (
  id serial primary key,
  sender text not null,
  message text not null,
  created_at timestamp default now()
);

create table keys (
  id serial primary key,
  key text not null,
  created_at timestamp default now()
);

begin;
drop publication if exists supabase_realtime;
create publication supabase_realtime;
commit;

alter publication supabase_realtime add table messages;
```

Then configure your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY` in your `.env.local` file.

### Saving Messages

Instead of adding new messages to the `messages` array in the `<Chat>` component, we're going to save them to the database instead.

**👉 ACTION**: Change the `sendMessage()` method in `chat.tsx` to:

```ts
const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const encryptedSender = await encryptMessage(sender, publicKey);
  const encryptedMessage = await encryptMessage(message, publicKey);
  await saveMessage(encryptedSender, encryptedMessage);
  setMessage("");
};
```

**👉 ACTION**: Now write the `saveMessage()` method to save the name and message to the database. (See the [Supabase insert docs][supabase-insert].)

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to save these to the database in the `@/lib/supabase.ts` file. Feel free to import this into `chat.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: When using the chat, the text won't show up in the page anymore, but you will see it in encrypted form in Supabase.

### Done

You've reached the end of step 5 and should have encrypted messages being saved to the database.

---

[▶️ STEP 6: Retrieveing Messages from the Database](./STEP-6-RETRIEVING-FROM-DATABASE.md)

_[🔙 Back to step 4: Decrypting Messages](./STEP-4-DECRYPTING-MESSAGES.md)_

[ben-twitter]: https://twitter.com/bendechrai
[supabase-insert]: https://supabase.com/docs/reference/javascript/insert