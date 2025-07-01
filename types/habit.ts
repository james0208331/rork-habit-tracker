export type Habit = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: {
    type: 'daily' | 'weekly';
    days?: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
  streak: number;
  goal?: number;
};

export type HabitCompletion = {
  date: string;
  completed: boolean;
};