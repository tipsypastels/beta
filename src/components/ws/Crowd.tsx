import { useEffect, useState } from "react";
import type { ServerUser } from "../../types/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/pro-solid-svg-icons";
import { $connected, $username, wsOn, wsSend } from "./store";
import { useStore } from "@nanostores/react";

export function Crowd() {
  const connected = useStore($connected);
  const [users, setUsers] = useState<ServerUser[]>([]);

  useEffect(() => {
    wsOn((message) => {
      if (message.type !== "users") return;
      setUsers(message.users);
    });
  }, []);

  useEffect(() => {
    if (!connected) return;
    const username = localStorage.getItem("beta:username");
    if (username) {
      wsSend({ type: "identify", username });
      $username.set(username);
    }
  }, [connected]);

  if (users.length === 0) return null;

  return (
    <aside>
      <div className="inline-flex items-center rounded-2xl border-2 border-yellow-600 bg-stone-950 p-2">
        <FontAwesomeIcon icon={faEye} className="text-yellow-600" size="2x" />
        <ul className="ml-2 flex gap-2">
          {users.map((user) => (
            <li
              key={user.uuid}
              style={{ backgroundColor: user.color }}
              className="flex h-8 w-8 items-center justify-center rounded-full border-yellow-600 text-xl font-bold text-black select-none data-[idle=true]:opacity-50 data-[you=true]:border-2"
              title={`${user.username ?? "Guest"}${user.you ? " (You)" : ""}`}
              data-you={user.you}
              data-idle={
                !user.you && user.active <= Date.now() - 10 * 60 * 1000
              }
            >
              {user.username?.charAt(0).toUpperCase() ?? "?"}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
