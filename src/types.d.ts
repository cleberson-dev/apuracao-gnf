import WebSocket from "ws";

declare module "ws" {
  interface Server {
    broadcast: (message: any) => void;
  }
}
