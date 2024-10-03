import WebSocket from "ws";

declare module "ws" {
  interface Server {
    broadcast: (message: any) => void;
  }
}

type Zone = "urbana" | "rural";

type Section = {
  id: number;
  number: string;
  local: string;
  voters: number;
  zone: Zone;
  closed: boolean;
  votes: Record<number | "outros", number>;
};

type Candidate = {
  number: number | "outros";
  name: string;
  color: string;
  profilePicture: string;
};
