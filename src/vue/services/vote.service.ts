import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export class VoteService {
  static vote(section: number, amountOfVotes: number) {
    return client.patch(`/secoes/${section}/votos`, {
      votos: amountOfVotes,
    });
  }

  static cleanVotes() {
    return client.get("/limparVotos");
  }
}
