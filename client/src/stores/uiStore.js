import { create } from 'zustand';

const useUiStore = create((set) => ({
  isModalOpen: false,
  modalContent: null,

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));

export default useUiStore;