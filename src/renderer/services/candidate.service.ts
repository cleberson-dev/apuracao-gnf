import type { Candidate } from "../../types";
import candidates from "../data/candidates.json";

export default class CandidateService {
  static getAll(): Candidate[] {
    console.log(
      candidates.map((c) => [
        new URL(
          `../candidates/${c.numero}.jpg`,
          import.meta.url.split("/").slice(0, -2).join("/")
        ),
      ])
    );
    return candidates.map((candidate) => ({
      name: candidate.nome,
      number: candidate.numero,
      profilePicture: (import.meta as any).env.PROD
        ? new URL(
            `./candidates/${candidate.numero}.jpg`,
            import.meta.url.split("/").slice(0, -1).join("/")
          ).href
        : `/candidates/${candidate.numero}.jpg`,
      color: candidate.cor,
    }));
  }
}
