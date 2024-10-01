import type { Candidate } from "../../types";
import candidates from "../data/candidates.json";

export default class CandidateService {
  static getAll(): Candidate[] {
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

  static sortedCandidates() {
    const orderByNumber = [22, 40, 44];
    const unsortedCandidates = CandidateService.getAll();
    const getNumber = (num: Candidate["number"]): number =>
      num === "outros" ? 0 : num;
    unsortedCandidates.sort((a, b) => {
      let [numA, numB] = [
        orderByNumber.indexOf(getNumber(a.number)),
        orderByNumber.indexOf(getNumber(b.number)),
      ];
      if (numA === -1) {
        numA = Infinity;
      }
      if (numB === -1) {
        numB = Infinity;
      }

      return numA - numB;
    });
    return unsortedCandidates;
  }
}
