export class UtilService {
  static async screenshot() {
    const res = await fetch("http://localhost:5000/print");
    const { data } = (await res.json()) as {
      data: { name: string; path: string };
    };

    return data;
  }

  static playAlert() {
    const alert = new Audio("update-alert.mp3");
    alert.play();
  }
}
