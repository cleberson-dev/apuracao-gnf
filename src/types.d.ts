import WebSocket from "ws";

declare module "ws" {
  interface Server {
    broadcast: (message: any) => void;
  }
}

type Section = {
  number: number;
  voters: number;
  local: string;
  zone?: "urbana" | "rural";
};

type Vote = {
  sectionId: number;
  candidateNumber: number;
  amount: number;
};

type Candidate = {
  number: number | "outros";
  name: string;
  color: string;
  profilePicture: string;
};
