import axios from "axios";
import { DbCandidate } from "../../db";
import { Candidate } from "../../types";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export default class CandidateService {
  static async fetchAll(): Promise<Candidate[]> {
    const { data } = await client.get<DbCandidate[]>("/candidatos");
    return data.map((dbCandidate) => ({
      number: dbCandidate.numero !== 0 ? dbCandidate.numero : "outros",
      name: dbCandidate.nome,
      color: dbCandidate.cor,
      profilePicture: dbCandidate.perfil,
    }));
  }
}
