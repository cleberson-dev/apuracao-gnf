import WebSocket from "ws";

declare module "ws" {
  interface Server {
    broadcast: (message: any) => void;
  }
}

declare global {
  interface Window {
    electronAPI: {
      appVersion?: string;
      registerVotes: (
        sectionId: number,
        votes: Record<number | "outros", number>
      ) => void;
      onVotesRegistered: (
        cb: (
          ev: any,
          sectionId: number,
          votes: Record<number | "outros", number>
        ) => void
      ) => void;
      offVotesRegistered: (
        cb: (
          ev: any,
          sectionId: number,
          votes: Record<number | "outros", number>
        ) => void
      ) => void;
      onMessage: (cb: (ev: any, text: string) => void) => void;
      offMessage: (cb: (ev: any, text: string) => void) => void;
      onUpdateDownloaded: (cb: () => void) => void;
      onUpdateAvailable: (cb: () => void) => void;
      onUpdateError: (cb: () => void) => void;
      updateAndRestartApp: () => void;
      onRestoreSections: (cb: () => void) => void;
      onRemoveAllSections: (cb: () => void) => void;
      onSectionsUploadUploading: (cb: () => void) => void;
      onSectionsUploadSuccess: (cb: () => void) => void;
      onSectionsUploadFail: (cb: () => void) => void;
      importSections: () => Promise<Section[] | undefined>;
    };
  }
}

type Zone = "urbana" | "rural";

type Section = {
  id: number;
  number: string;
  local: string;
  voters: number;
  zone: Zone;
  closed: boolean;
  votes: Record<number | "outros", number>;
};

type Candidate = {
  number: number | "outros";
  name: string;
  color: string;
  profilePicture: string;
};
