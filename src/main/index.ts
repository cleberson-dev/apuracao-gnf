import { app, protocol, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "url";

import { AutoUpdater } from "./auto-updater.js";
import { listenToRendererEvents } from "./listeners.js";
import { getMenu } from "./menu.js";
import { MAIN_WINDOW_OPTIONS } from "./constants.js";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  const win = new BrowserWindow(MAIN_WINDOW_OPTIONS);
  const autoUpdater = new AutoUpdater(win);
  const menu = getMenu(win);
  Menu.setApplicationMenu(menu);

  if ((import.meta as any).env.DEV) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]!);
  } else {
    win.loadFile(
      fileURLToPath(new URL("../renderer/index.html", import.meta.url))
    );
  }

  return [win, autoUpdater] as const;
}

app.on("window-all-closed", () => {
  if (process.platform === "darwin") return;
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length !== 0) return;
  createWindow();
});

app.whenReady().then(() => {
  const [win, autoUpdater] = createWindow();
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

  listenToRendererEvents(win, autoUpdater);
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
