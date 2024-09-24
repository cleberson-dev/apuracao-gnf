import { RepositorySection } from "../repositories/section.repository";
import { Candidate } from "../types";

export const sortCandidates = (
  candidates: Candidate[],
  sections: RepositorySection[]
) => {
  return candidates.sort((a, b) => {
    const votesA = sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votes[a.number], 0);
    const votesB = sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votes[b.number], 0);

    return votesB - votesA;
  });
};
