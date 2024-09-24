import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export class VoteService {
  static vote(section: number, votes: Record<number | "outros", number>) {
    console.log(votes);
    return client.post(`/votos/${section}`, votes);
  }

  static cleanVotes() {
    return client.get("/limpar-votos");
  }

  static async getAllVotes() {
    const { data } = await client.get<
      {
        sectionNumber: number;
        votes: Record<number | "outros", number>;
      }[]
    >("/votos");
    return data;
  }
}
