import { useStore } from "@nanostores/react";
import { $connected, $username, wsSend } from "./store";
import { useState } from "react";

export function Login() {
  const connected = useStore($connected);
  const username = useStore($username);
  const [usernameInput, setUsernameInput] = useState("");

  if (!connected || username) return null;

  return (
    <form
      className="fixed bottom-0 left-0 my-8 flex w-screen items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (!usernameInput) return;

        wsSend({ type: "identify", username: usernameInput });
        $username.set(usernameInput);
        localStorage.setItem("beta:username", usernameInput);
      }}
    >
      <input
        className="rounded-lg border-2 border-white bg-yellow-600 p-4 shadow-2xl"
        placeholder="Enter a username?"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
    </form>
  );
}
