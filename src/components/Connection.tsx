import { useCallback, useEffect, useRef, useState } from "react";

const USERNAME_LS_KEY = "beta:username";

type ClientMessage = { type: "identify"; username: string };
type ServerMessage = { type: "users"; users: ServerUser[] };

interface ServerUser {
  uuid: string;
  username?: string;
  color: string;
  you?: boolean;
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
      console.log("Got message", message);
      switch (message.type) {
        case "users": {
          setUsers(message.users);
          break;
        }
      }
    };
  }, [path, connected]);

  useEffect(() => {
    return () => ws.current?.close();
  }, []);

  return (
    <aside>
      <div>
        <strong>Viewing:</strong>
        <ul className="inline">
          {users.map((user) => (
            <li
              key={user.uuid}
              style={{ color: user.color }}
              className="inline-block rounded-lg p-1 text-sm font-bold text-black"
            >
              @{user.username ?? "Guest"}
              {user.you ? " (You)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
