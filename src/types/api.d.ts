export type ClientMessage =
  | { type: "identify"; username: string }
  | { type: "active"; scroll?: number };

export type ServerMessage = { type: "users"; users: ServerUser[] };

export interface ServerUser {
  uuid: string;
  username?: string;
  color: string;
  you?: boolean;
  active: number;
  scroll: number;
}
