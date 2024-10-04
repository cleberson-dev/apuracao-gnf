import { push } from "notivue";
import { useSectionStore } from "../store/section.store";
import { UtilService } from "../services/util.service";

const logElectronMessage = (_: any, text: any) => {
  console.log("__ELECTRON__MAIN__MESSAGE", text);
};

export default function listenToMainEvents(
  openConfirmationDialog: (confirmFn: () => void) => void
) {
  const sectionStore = useSectionStore();

  (window as any).electronAPI.onMessage(logElectronMessage);

  // Listening for Auto-Update Events
  let uploadNotification: ReturnType<typeof push.promise>;
  (window as any).electronAPI.onUpdateAvailable(() => {
    uploadNotification = push.promise({
      title: "Atualização disponível!",
      message: "Realizando o download...",
    });
  });

  (window as any).electronAPI.onUpdateDownloaded(() => {
    uploadNotification.success<{ isUpdateDownloaded: boolean }>({
      title: "✅ Download de Atualização Completo!",
      duration: 20000,
      message:
        "Caso queira que atualize imediatamente, clique no botão abaixo.",
      props: {
        isUpdateDownloaded: true,
      },
    });
  });

  (window as any).electronAPI.onUpdateError(() => {
    uploadNotification.error({
      title: "Atualização não concluída!",
      message: "Algo aconteceu enquanto atualizava a aplicação.",
    });
  });

  (window as any).electronAPI.onRemoveAllSections(() => {
    openConfirmationDialog(() => {
      sectionStore.removeAllSections();
      push.info("Todas as seções foram removidas");
    });
  });
  (window as any).electronAPI.onRestoreSections(() => {
    openConfirmationDialog(async () => {
      const importedSections = await UtilService.importSections();
      sectionStore.reset(importedSections);
      push.info("Seções restauradas");
    });
  });

  let sectionsUploadNotification: ReturnType<typeof push.promise>;
  (window as any).electronAPI.onSectionsUploadUploading(() => {
    sectionsUploadNotification = push.promise({
      title: "Importando Seções",
      message: "Aguarde enquanto estamos importando seu arquivo...",
    });
  });

  (window as any).electronAPI.onSectionsUploadSuccess(() => {
    sectionsUploadNotification.success({
      title: "Importação concluída",
      message: "Para usar, basta restaurar as seções",
    });
  });
}