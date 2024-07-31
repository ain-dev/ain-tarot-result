import { create } from 'zustand';

type tarotState = {
  ageGroup: string;
  tarotGender: string;
  category: string;
  categoryDetail: string;
  speechToText: string;
  postCardList: [];
  qrCode: string;
};

type Actions = {
  setAgeGroup: (newAgeGroup: string) => void;
  setTarotGender: (newTarotGender: string) => void;
  setCategory: (newCategory: string) => void;
  setCategoryDetail: (newCategoryDetail: string) => void;
  setSpeechToText: (newSpeechToText: string) => void;
  setPostCardList: (newImageList: []) => void;
  setQrCode: (newQrCode: string) => void;
  resetTarotState: () => void;
};

const tarotInitialState: tarotState = {
  ageGroup: '',
  tarotGender: '여성',
  category: '',
  categoryDetail: '',
  speechToText: '',
  postCardList: [],
  qrCode: '',
};

const useTarotStore = create<tarotState & Actions>((set) => ({
  ...tarotInitialState,
  setAgeGroup: (newAgeGroup: string) => set({ ageGroup: newAgeGroup }),
  setTarotGender: (newTarotGender: string) =>
    set({ tarotGender: newTarotGender }),
  setCategory: (newCategory: string) => set({ category: newCategory }),
  setCategoryDetail: (newCategoryDetail: string) =>
    set({ categoryDetail: newCategoryDetail }),
  setSpeechToText: (newSpeechToText: string) =>
    set({ speechToText: newSpeechToText }),
  setPostCardList: (newPostCardList: []) =>
    set({ postCardList: newPostCardList }),
  setQrCode: (newQrCode: string) => set({ qrCode: newQrCode }),
  resetTarotState: () => set(tarotInitialState),
}));

export default useTarotStore;
