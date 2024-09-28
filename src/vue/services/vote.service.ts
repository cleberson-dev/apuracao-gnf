import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export class VoteService {
  static vote(sectionId: number, votes: Record<number | "outros", number>) {
    return client.post(`/votos/${sectionId}`, votes);
  }

  static cleanVotes() {
    return client.get("/limpar-votos");
  }

  static async getAllVotes() {
    const { data } = await client.get<
      {
        sectionId: number;
        votes: Record<number | "outros", number>;
      }[]
    >("/votos");
    return data;
  }
}
