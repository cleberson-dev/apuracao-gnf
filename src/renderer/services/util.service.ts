import html2canvas from "html2canvas";
import type { Section } from "../../types";

export class UtilService {
  static async screenshot(): Promise<string> {
    const canvas = await html2canvas(document.querySelector("main")!, {
      windowWidth: 1366,
      windowHeight: 768,
    });
    // const ctx = canvas.getContext("2d");
    const image = canvas.toDataURL("image/png");

    return image;
  }

  static playAlert() {
    const alert = new Audio("urna.mp3");
    alert.play();
  }

  static async importSections(): Promise<Section[] | undefined> {
    const data = await (window as any).electronAPI.importSections();
    return data;
  }
}
