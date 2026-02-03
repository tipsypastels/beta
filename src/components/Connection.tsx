import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/pro-solid-svg-icons";

const USERNAME_LS_KEY = "beta:username";

type ClientMessage =
  | { type: "identify"; username: string }
  | { type: "active" };

type ServerMessage = { type: "users"; users: ServerUser[] };

interface ServerUser {
  uuid: string;
  username?: string;
  color: string;
  you?: boolean;
  active: number;
}

export interface ConnectionProps {
  path: string;
}

export function Connection({ path }: ConnectionProps) {
  const ws = useRef<WebSocket>(null);

  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string>();
  const [users, setUsers] = useState<ServerUser[]>([]);

  const send = useCallback((message: ClientMessage) => {
    ws.current!.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    if (connected) return;

    ws.current = new WebSocket(
      `${import.meta.env.PUBLIC_BETA_API}/ws?path=${encodeURIComponent(path)}`,
    );

    ws.current.onopen = () => {
      const username = localStorage.getItem(USERNAME_LS_KEY);
      if (username) send({ type: "identify", username });

      console.log("Connected!");
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;
      switch (message.type) {
        case "users": {
          setUsers(message.users);
          break;
        }
      }
    };
  }, [path, connected]);

  useEffect(() => {
    let active = false;

    const interval = setInterval(() => {
      if (active) send({ type: "active" });
      active = false;
    }, 60 * 1000);

    document.addEventListener("scroll", () => {
      active = true;
    });

    document.addEventListener("mousemove", () => {
      active = true;
    });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => ws.current?.close();
  }, []);

  if (!connected) return null;

  return (
    <aside>
      {users.length > 0 ? (
        <div className="fixed right-0 bottom-0 p-16 md:top-0 md:bottom-[unset]">
          <div className="flex items-center rounded-2xl border-2 border-yellow-600 bg-stone-950 p-2">
            <FontAwesomeIcon
              icon={faEye}
              className="text-yellow-600"
              size="2x"
            />
            <ul className="ml-2 flex gap-2">
              {users.map((user) => (
                <li
                  key={user.uuid}
                  style={{ backgroundColor: user.color }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-yellow-600 text-xl font-bold text-black select-none data-[idle=true]:opacity-50 data-[you=true]:border-2"
                  title={`${user.username ?? "Guest"}${user.you ? " (You)" : ""}`}
                  data-you={user.you}
                  data-idle={user.active <= Date.now() - 10 * 60 * 1000}
                  data-active={user.active}
                >
                  {user.username?.charAt(0).toUpperCase() ?? "?"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
