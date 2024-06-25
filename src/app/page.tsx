"use client";
import { useEffect, useState } from "react";
import { loadSender, saveSender } from "@/lib/idb";
import Chat from "@/components/chat";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sender, setSender] = useState("");
  const [senderInput, setSenderInput] = useState("");

  const handleSenderSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await saveSender(senderInput);
    setSender(senderInput);
  };

  useEffect(() => {
    async function doLoadSender() {
      const sender = await loadSender();
      setSender(sender);
      setIsLoaded(true);
    }
    doLoadSender();
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!sender) {
    return (
      <>
        <p>What name do you want to use in this chat?</p>
        <form onSubmit={handleSenderSubmit}>
          <input
            type="text"
            value={senderInput}
            onChange={(e) => setSenderInput(e.target.value)}
          />
          <button type="submit">Set name</button>
        </form>
      </>
    );
  }

  return <Chat sender={sender} />;
}
