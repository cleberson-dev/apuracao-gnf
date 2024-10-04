import {
  BrowserWindowConstructorOptions,
  WindowOpenHandlerResponse,
} from "electron";
import { fileURLToPath } from "url";

export const IMPORTED_SECTIONS_PATH = "IMPORTED_SECTIONS.json";
export const MAIN_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  width: 1366,
  height: 768,
  fullscreen: false,
  show: true,
  autoHideMenuBar: false,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: true,
    nodeIntegrationInSubFrames: true,
    preload: fileURLToPath(new URL("../preload/index.cjs", import.meta.url)),
  },
};
