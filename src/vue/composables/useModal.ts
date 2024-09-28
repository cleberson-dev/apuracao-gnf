import { useModalStore } from "../store/modal.store";

export default function useModal() {
  const { addModal, remove, pop } = useModalStore();

  return { addModal, remove, pop };
}
