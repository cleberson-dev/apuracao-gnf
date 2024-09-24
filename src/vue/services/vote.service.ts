import axios from "axios";
import { SectionVotes } from "../../repositories/section.repository";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export class VoteService {
  static vote(section: number, votes: SectionVotes) {
    return client.patch(`/secoes/${section}/votos`, {
      votos: votes,
    });
  }

  static cleanVotes() {
    return client.get("/limparVotos");
  }
}
