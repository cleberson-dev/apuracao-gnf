import { Candidate } from "../../types";
import candidates from "../candidates.json";

export default class CandidateService {
  static getAll(): Candidate[] {
    return candidates.map((candidate) => ({
      name: candidate.nome,
      number: candidate.numero,
      profilePicture: `/candidates/${candidate.codigo}.jpg`,
      color: candidate.cor,
    }));
  }
}
