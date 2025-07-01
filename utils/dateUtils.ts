export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (date: Date): number => {
  return date.getDate();
};

export const getLastNDays = (n: number): Date[] => {
  const result: Date[] = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date);
  }
  return result.reverse();
};

export const calculateStreak = (completions: Record<string, boolean>): number => {
  const sortedDates = Object.keys(completions)
    .filter(date => completions[date])
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (sortedDates.length === 0) return 0;
  
  let streak = 1;
  const today = getTodayFormatted();
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  
  // Check if the most recent completion is today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i + 1]);
    
    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};