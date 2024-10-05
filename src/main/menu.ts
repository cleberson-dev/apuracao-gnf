import {
  BrowserWindow,
  dialog,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from "electron";
import { getSectionDataFromXLSX } from "../utils.js";
import { ENABLE_IMPORT_SECTIONS, IMPORTED_SECTIONS_PATH } from "./constants.js";
import { writeFile } from "fs/promises";

export function getMenu(win: BrowserWindow) {
  const appMenu = Menu.getApplicationMenu()!;
  const newMenu = [...appMenu.items] as Array<
    MenuItemConstructorOptions | MenuItem
  >;

  const importMenuItem = {
    label: "Importar de XLSX",
    click: async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [
          {
            name: "Arquivos XLSX",
            extensions: ["xlsx"],
          },
        ],
      });
      if (!canceled) {
        win.webContents.send("sectionsUpload:uploading");
        const sections = await getSectionDataFromXLSX(filePaths[0], 4);

        if (
          !sections ||
          sections.some((section) =>
            Object.values(section).some((val) => !val && val !== 0)
          )
        ) {
          win.webContents.send("sectionsUpload:fail");
          return;
        }

        await writeFile(IMPORTED_SECTIONS_PATH, JSON.stringify(sections));
        win.webContents.send("sectionsUpload:success", {
          sectionsLength: sections.length,
        });
      }
    },
  } as MenuItemConstructorOptions;

  const sectionsMenu = {
    label: "Seções",
    submenu: [
      {
        label: "Remover todas",
        click: () => {
          win.webContents.send("remove-all-sections");
        },
      } as MenuItemConstructorOptions,
      {
        label: "Restaurar",
        click: () => win.webContents.send("restore-sections"),
      } as MenuItemConstructorOptions,
    ],
  };

  newMenu.splice(1, 0, sectionsMenu);
  if (ENABLE_IMPORT_SECTIONS) {
    (sectionsMenu.submenu as (MenuItemConstructorOptions | MenuItem)[])!.push(
      importMenuItem
    );
  }
  return Menu.buildFromTemplate(newMenu);
}
