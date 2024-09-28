import axios from "axios";

export type Zone = "urbana" | "rural";

export type Section = {
  id: number;
  number: number;
  local: string;
  voters: number;
  zone: Zone;
  closed: boolean;
  votes: Record<number | "outros", number>;
};

const api = axios.create({ baseURL: "http://localhost:5000" });

export default class SectionService {
  static async fetchAll(): Promise<Section[]> {
    const { data } = await api.get<Section[]>("/secoes");
    return data;
  }

  static async create(payload: Omit<Section, "id" | "closed" | "votes">) {
    const { data } = await api.post<Section>("/secoes", {...payload, local: payload.local.toUpperCase()} satisfies Omit<Section, "id" | "closed" | "votes">);
    return data;
  }

  static async update(
    sectionId: number,
    payload: Partial<Omit<Section, "id">>
  ) {
    const { data } = await api.patch<Section>(`/secoes/${sectionId}`, payload);
    return data;
  }

  static async removeAll() {
    await api.delete("/secoes");
    return true;
  }

  static async removeSection(sectionId: number) {
    await api.delete(`/secoes/${sectionId}`);
    return true;
  }
}
