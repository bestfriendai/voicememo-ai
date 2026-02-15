// VoiceMemo AI - Store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VoiceMemo {
  id: string;
  title: string;
  transcript: string;
  summary: string;
  tags: string[];
  audioUri: string;
  duration: number;
  createdAt: number;
  isPremium: boolean;
}

interface VoiceMemoState {
  memos: VoiceMemo[];
  isPremium: boolean;
  isRecording: boolean;
  currentRecordingUri: string | null;
  addMemo: (memo: VoiceMemo) => void;
  deleteMemo: (id: string) => void;
  updateMemo: (id: string, updates: Partial<VoiceMemo>) => void;
  setIsPremium: (isPremium: boolean) => void;
  setIsRecording: (isRecording: boolean) => void;
  setCurrentRecordingUri: (uri: string | null) => void;
  loadMemos: () => Promise<void>;
  saveMemos: () => Promise<void>;
}

const STORAGE_KEY = 'voicememo_memos';
const PREMIUM_KEY = 'voicememo_premium';

export const useVoiceMemoStore = create<VoiceMemoState>((set, get) => ({
  memos: [],
  isPremium: false,
  isRecording: false,
  currentRecordingUri: null,
  
  addMemo: (memo) => {
    set((state) => ({ memos: [memo, ...state.memos] }));
    get().saveMemos();
  },
  
  deleteMemo: (id) => {
    set((state) => ({ memos: state.memos.filter((m) => m.id !== id) }));
    get().saveMemos();
  },
  
  updateMemo: (id, updates) => {
    set((state) => ({
      memos: state.memos.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    get().saveMemos();
  },
  
  setIsPremium: (isPremium) => {
    set({ isPremium });
    AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(isPremium));
  },
  
  setIsRecording: (isRecording) => set({ isRecording }),
  
  setCurrentRecordingUri: (uri) => set({ currentRecordingUri: uri }),
  
  loadMemos: async () => {
    try {
      const [memosJson, premiumJson] = await AsyncStorage.multiGet([STORAGE_KEY, PREMIUM_KEY]);
      const memos = memosJson[1] ? JSON.parse(memosJson[1]) : [];
      const isPremium = premiumJson[1] ? JSON.parse(premiumJson[1]) : false;
      set({ memos, isPremium });
    } catch (error) {
      console.error('Failed to load memos:', error);
    }
  },
  
  saveMemos: async () => {
    try {
      const { memos, isPremium } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
      await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(isPremium));
    } catch (error) {
      console.error('Failed to save memos:', error);
    }
  },
}));
