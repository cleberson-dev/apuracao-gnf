import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";

import { autoUpdater as electronUpdaterAutoUpdater } from "electron-updater";
import logger from "electron-log";

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

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    fullscreen: false,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      preload: fileURLToPath(new URL("../preload/index.cjs", import.meta.url)),
    },
  });

  const autoUpdater = new AutoUpdater(win);

  if ((import.meta as any).env.DEV) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]!);
  } else {
    win.loadFile(
      fileURLToPath(new URL("../renderer/index.html", import.meta.url))
    );
  }

  return [win, autoUpdater] as const;
  // return win;
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const [win, autoUpdater] = createWindow();
  // const win = createWindow();

  autoUpdater.checkForUpdates();

  win.webContents.setWindowOpenHandler((details) => {
    return {
      action: "allow",
      createWindow: (opts) => {
        const win = new BrowserWindow(opts);
        win.loadURL(details.url);
        win.setSize(1366, 768);
        return win.webContents;
      },
      overrideBrowserWindowOptions: {
        webPreferences: {
          preload: fileURLToPath(
            new URL("../preload/index.cjs", import.meta.url)
          ),
          nativeWindowOpen: true,
        },
      },
    };
  });
  ipcMain.on(
    "register-votes",
    (_, sectionId: number, votes: Record<number | "outros", number>) => {
      win.webContents.send("votes-registered", sectionId, votes);
      win
        .getChildWindows()
        .forEach((win) =>
          win.webContents.send("votes-registered", sectionId, votes)
        );
    }
  );

  ipcMain.on("update-and-restart", () => {
    autoUpdater.install();
  });
});

// Exit cleanly on request from parent process in development mode.
if ((import.meta as any).env.DEV) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
