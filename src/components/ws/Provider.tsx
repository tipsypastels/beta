import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $connected, $handlers, $ws } from "./store";

export interface ProviderProps {
  path: string;
}

export function Provider({ path }: ProviderProps) {
  const connected = useStore($connected);

  useEffect(() => {
    if (connected) return;

    const ws = new WebSocket(
      `${import.meta.env.PUBLIC_BETA_API}/ws?path=${encodeURIComponent(path)}`,
    );

    ws.onopen = () => {
      console.log("Connected!");
      $connected.set(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      for (const handler of $handlers.get()) {
        handler(message);
      }
    };

    $ws.set(ws);

    return () => {
      if (!connected) return;
      $ws.get()?.close();
      console.log("Disconnected.");
    };
  }, [path, connected]);

  return null;
}
