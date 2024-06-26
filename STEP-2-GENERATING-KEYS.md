# Write Your Own Secure Messenger

This repo contains the guide and code for [Ben Dechrai][ben-twitter]'s workshop, "Write Your Own Secure Messenger".

## Step 2 - Generating Keys

### Public Private Keys

We're going to use the [SubtleCrypto: generateKey() method][mdn-web-crypto-generatekey] in order to generate a key pair for each new user.

**👉 ACTION**: Add the following to `page.tsx` right before it returns `<Chat>`:

```ts
  if (!publicKey || !privateKey) {
    return (
      <>
        <p>
          You don&apos;t have a key pair yet.{" "}
          <button onClick={runKeyGeneration}>Generate a new key pair</button>
        </p>
      </>
    );
  }
```

**👉 ACTION**: Add the state variables and setters near the top of the component:

```ts
  const [publicKey, setPublicKey] = useState<CryptoKey | null>();
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>();
```

**👉 ACTION**: Now write the code inside the `Home()` component to:

1. Generate the Public/Private Keys (see the [web crypto generatekey docs][mdn-web-crypto-generatekey]);
2. Save the keys to Indexed DB (see the [indexed db docs][mdn-indexed-db]); and
3. Store the keys in state (`useState`).

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to generate the keys in the `@/lib/crypto.ts` file, and the code to save the keys to Indexed DB in the `@/lib/idb.ts` file. Feel free to import this into `page.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: You should be promted to generate a keypair, and when that's done, you should see the keypair saved to Indexed DB (check the Application tab in your browser's developer tools).

### Retrieving the Keypair

If you refresh your web application again though, you'll be prompted to generate another keypair. We don't want this. We want to load the previous keypair if it exists.

**👉 ACTION**: Add the following to `page.tsx` right before the code you just added starting `if (!publicKey || !privateKey) {`:

```ts
  if (!keysLoaded) {
    return <p>Loading...</p>;
  }
```

**👉 ACTION**: Add the following inside the `useEffect()` block of the same file, right after `doLoadSender();`:

```ts
    async function doLoadKeypairs() {
      const keys = await loadKeypairs();
      if (keys) {
        setPublicKey(keys.publicKey);
        setPrivateKey(keys.privateKey);
      }
      setKeysLoaded(true);
    }
    doLoadKeypairs();
```

**👉 ACTION**: Now write the `loadKeypairs()` method to retrieve them from Indexed DB. (See the [indexed db docs][mdn-indexed-db].)

> **💡 TIP**: If you don't want to research and write this from scratch, you can find the code required to load the keys in the `@/lib/idb.ts` file. Feel free to import this into `page.tsx` and use as required.

### Test the App

**👉 ACTION**: Refresh the web application

**🧪 CHECKPOINT**: You should see the chat window again, which means the keypair was successfully loaded.

### Done

You've reached the end of step 2 and should have a keypair for your current user.

---

[▶️ STEP 3: Encrypting Messages](./STEP-3-ENCRYPTING-MESSAGES.md)

_[🔙 Back to step 1: Setting up](STEP-1-SETTING-UP.md)_

[ben-twitter]: https://twitter.com/bendechrai
[mdn-indexed-db]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[mdn-web-crypto-generatekey]: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey