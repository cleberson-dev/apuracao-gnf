import axios from "axios";

export class UtilService {
  static async screenshot() {
    const res = await axios.get<{ data: { name: string; path: string } }>(
      "http://localhost:5000/print"
    );
    const { data } = res.data;

    return data;
  }

  static playAlert() {
    const alert = new Audio("update-alert.mp3");
    alert.play();
  }
}
