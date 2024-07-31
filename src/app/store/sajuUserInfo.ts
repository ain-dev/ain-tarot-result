import { create } from 'zustand';

type State = {
  target: string;
  birthdateType: string;
  birthdate: string;
  sajuGender: string;
  postCardList: [];
  qrCode: string;
};

type Actions = {
  setTarget: (newTarget: string) => void;
  setBirthdate: (newBirthday: string) => void;
  setBirthdateType: (newBirthdateType: string) => void;
  setSajuGender: (newSajuGender: string) => void;
  setPostCardList: (newImageList: []) => void;
  setQrCode: (newQrCode: string) => void;
  resetSajuState: () => void;
};

const sajuInitialState: State = {
  target: '본인',
  birthdateType: '양력',
  birthdate: '',
  sajuGender: '여성',
  postCardList: [],
  qrCode: '',
};

const useSajuStore = create<State & Actions>((set) => ({
  ...sajuInitialState,
  setTarget: (newTarget: string) => set({ target: newTarget }),
  setBirthdate: (newBirthdate: string) => set({ birthdate: newBirthdate }),
  setBirthdateType: (newBirthdateType: string) =>
    set({ birthdateType: newBirthdateType }),
  setSajuGender: (newSajuGender: string) => set({ sajuGender: newSajuGender }),
  setPostCardList: (newPostCardList: []) =>
    set({ postCardList: newPostCardList }),
  setQrCode: (newQrCode: string) => set({ qrCode: newQrCode }),
  resetSajuState: () => set(sajuInitialState),
}));

export default useSajuStore;
