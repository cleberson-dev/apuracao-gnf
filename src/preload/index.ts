import { contextBridge, ipcRenderer } from "electron";
import { Section } from "../types.js";

contextBridge.exposeInMainWorld("electronAPI", {
  registerVotes: (
    sectionId: number,
    votes: Record<number | "outros", number>
  ) => ipcRenderer.send("register-votes", sectionId, votes),
  onVotesRegistered: (
    cb: (
      ev: any,
      sectionId: number,
      votes: Record<number | "outros", number>
    ) => void
  ) => ipcRenderer.on("votes-registered", cb),
  offVotesRegistered: (
    cb: (
      ev: any,
      sectionId: number,
      votes: Record<number | "outros", number>
    ) => void
  ) => ipcRenderer.off("votes-registered", cb),
  onMessage: (cb: (ev: any, text: string) => void) =>
    ipcRenderer.on("message", cb),
  offMessage: (cb: (ev: any, text: string) => void) =>
    ipcRenderer.off("message", cb),
  onUpdateDownloaded: (cb: () => void) =>
    ipcRenderer.on("update-downloaded", cb),
  onUpdateAvailable: (cb: () => void) => ipcRenderer.on("update-available", cb),
  onUpdateError: (cb: () => void) => ipcRenderer.on("update-error", cb),
  updateAndRestartApp: () => ipcRenderer.send("update-and-restart"),
  onRestoreSections: (cb: () => void) => ipcRenderer.on("restore-sections", cb),
  onRemoveAllSections: (cb: () => void) =>
    ipcRenderer.on("remove-all-sections", cb),

  onSectionsUploadUploading: (cb: () => void) =>
    ipcRenderer.on("sectionsUpload:uploading", cb),
  onSectionsUploadSuccess: (cb: () => void) =>
    ipcRenderer.on("sectionsUpload:success", cb),
  importSections: (): Promise<Section[] | undefined> =>
    ipcRenderer.invoke("import-sections"),
});
