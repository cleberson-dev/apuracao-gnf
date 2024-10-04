import { autoUpdater as electronUpdaterAutoUpdater } from "electron-updater";
import logger from "electron-log";
import { BrowserWindow } from "electron";

export class AutoUpdater {
  constructor(private _win: BrowserWindow) {
    electronUpdaterAutoUpdater.logger = logger;
    electronUpdaterAutoUpdater.on("checking-for-update", () => {
      this._sendStatusToWindow("Checking for update...");
    });
    electronUpdaterAutoUpdater.on("update-available", () => {
      this._sendStatusToWindow("Update available.");
      this._win.webContents.send("update-available");
    });
    electronUpdaterAutoUpdater.on("update-not-available", () => {
      this._sendStatusToWindow("Update not available.");
    });
    electronUpdaterAutoUpdater.on("error", (err) => {
      this._sendStatusToWindow("Error in auto-updater. " + err);
      this._win.webContents.send("update-error");
    });
    electronUpdaterAutoUpdater.on("update-downloaded", () => {
      this._sendStatusToWindow("Update downloaded");
      this._win.webContents.send("update-downloaded");
    });
  }

  private _sendStatusToWindow(text: string) {
    logger.info(text);
    this._win.webContents.send("message", text);
  }

  checkForUpdates() {
    electronUpdaterAutoUpdater.checkForUpdatesAndNotify();
  }

  install() {
    electronUpdaterAutoUpdater.quitAndInstall();
  }
}
