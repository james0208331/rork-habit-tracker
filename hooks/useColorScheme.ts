import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import Colors from '@/constants/colors';

export function useColorScheme() {
  const nativeColorScheme = useNativeColorScheme();
  const userColorScheme = useSettingsStore(state => state.colorScheme);
  
  const getEffectiveColorScheme = () => {
    if (userColorScheme === 'auto') {
      return nativeColorScheme === 'dark' ? 'dark' : 'light';
    }
    return userColorScheme;
  };
  
  const effectiveScheme = getEffectiveColorScheme();
  const isDark = effectiveScheme === 'dark';
  
  return {
    colorScheme: effectiveScheme,
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}