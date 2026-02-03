import { atom } from "nanostores";
import type { ClientMessage, ServerMessage } from "../../types/api";

export const $ws = atom<WebSocket | undefined>();
export const $username = atom<string | undefined>();

export const $connected = atom(false);
export const $handlers = atom<((message: ServerMessage) => void)[]>([]);

export function wsSend(message: ClientMessage) {
  $ws.get()!.send(JSON.stringify(message));
}

export function wsOn(f: (message: ServerMessage) => void) {
  $handlers.set([...$handlers.get(), f]);
}
