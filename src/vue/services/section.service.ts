import sections from "../../sections";
import { RepositorySection, Zone } from "../../repositories/vote.repository";

export default class SectionService {
  static fetchAll(): RepositorySection[] {
    return sections.map((section) => ({
      number: section.numero,
      local: section.local,
      voters: section.eleitores,
      zone: section.zona as Zone,
      closed: section.totalizada,
    }));
  }
}
