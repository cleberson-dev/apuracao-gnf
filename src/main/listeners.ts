import { BrowserWindow, ipcMain } from "electron";
import { readFile } from "fs/promises";

import { AutoUpdater } from "./auto-updater.js";
import type { Section } from "../types.js";
import { checkFileExists } from "../utils.js";
import { IMPORTED_SECTIONS_PATH } from "./constants.js";

const notifyVotesRegisteredToAll =
  (win: BrowserWindow) =>
  (_: any, sectionId: number, votes: Record<number | "outros", number>) => {
    win.webContents.send("votes-registered", sectionId, votes);
    win
      .getChildWindows()
      .forEach((win) =>
        win.webContents.send("votes-registered", sectionId, votes)
      );
  };

const getImportedSections = async (): Promise<Section[] | undefined> => {
  if (!(await checkFileExists(IMPORTED_SECTIONS_PATH))) return undefined;
  const sections = await JSON.parse(
    (await readFile(IMPORTED_SECTIONS_PATH)).toString()
  );
  return sections;
};

export const listenToRendererEvents = (
  win: BrowserWindow,
  autoUpdater: AutoUpdater
) => {
  ipcMain.on("register-votes", notifyVotesRegisteredToAll(win));
  ipcMain.on("update-and-restart", autoUpdater.install);
  ipcMain.handle("import-sections", getImportedSections);
};
