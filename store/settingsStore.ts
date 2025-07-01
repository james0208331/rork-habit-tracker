import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'auto' | 'light' | 'dark';

interface SettingsState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorScheme: 'auto',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);