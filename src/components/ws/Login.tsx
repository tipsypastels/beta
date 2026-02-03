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
      onSubmit={(e) => {
        e.preventDefault();
        if (!usernameInput) return;

        wsSend({ type: "identify", username: usernameInput });
        $username.set(usernameInput);
        localStorage.setItem("beta:username", usernameInput);
      }}
    >
      <input
        className="fixed top-0 right-0 m-8 rounded-lg border-2 border-white bg-yellow-600 p-4 shadow-2xl"
        placeholder="Enter a username?"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
    </form>
  );
}
