import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';
import { formatDate, getTodayFormatted, calculateStreak } from '@/utils/dateUtils';

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'streak'>) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  getHabit: (id: string) => Habit | undefined;
  getCompletedToday: () => number;
  getTotalHabits: () => number;
  resetAllData: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      
      addHabit: (habitData) => {
        const newHabit: Habit = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          completions: {},
          streak: 0,
          ...habitData,
        };
        
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },
      
      toggleHabitCompletion: (id, date) => {
        set((state) => {
          const habitIndex = state.habits.findIndex(h => h.id === id);
          if (habitIndex === -1) return state;
          
          const habit = state.habits[habitIndex];
          const newCompletions = { ...habit.completions };
          
          // Toggle completion status
          newCompletions[date] = !newCompletions[date];
          
          // Calculate new streak
          const updatedHabit = {
            ...habit,
            completions: newCompletions,
            streak: calculateStreak(newCompletions),
          };
          
          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;
          
          return { habits: updatedHabits };
        });
      },
      
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter(habit => habit.id !== id),
        }));
      },
      
      updateHabit: (id, updates) => {
        set((state) => {
          const habitIndex = state.habits.findIndex(h => h.id === id);
          if (habitIndex === -1) return state;
          
          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = {
            ...updatedHabits[habitIndex],
            ...updates,
          };
          
          return { habits: updatedHabits };
        });
      },
      
      getHabit: (id) => {
        return get().habits.find(habit => habit.id === id);
      },
      
      getCompletedToday: () => {
        const today = getTodayFormatted();
        return get().habits.filter(habit => habit.completions[today]).length;
      },
      
      getTotalHabits: () => {
        return get().habits.length;
      },
      
      resetAllData: () => {
        set({ habits: [] });
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);