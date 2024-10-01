import { contextBridge, ipcRenderer } from "electron";

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
});
