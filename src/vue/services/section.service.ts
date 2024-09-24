import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export default class SectionService {
  static fetchAll() {
    return client.get("/secoes");
  }
}
