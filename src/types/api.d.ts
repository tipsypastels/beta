export type ClientMessage =
  | { type: "identify"; username: string }
  | { type: "active" };

export type ServerMessage = { type: "users"; users: ServerUser[] };

export interface ServerUser {
  uuid: string;
  username?: string;
  color: string;
  you?: boolean;
  active: number;
}
