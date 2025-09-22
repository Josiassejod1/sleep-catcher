// Date utility functions for Sleep Catcher

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const getYesterday = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
};

export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

export const isToday = (dateString: string): boolean => {
  return dateString === getToday();
};

export const isYesterday = (dateString: string): boolean => {
  return dateString === getYesterday();
};

export const daysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const subtractDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

export const getWeekStart = (date: Date = new Date()): string => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day; // First day of week (Sunday)
  start.setDate(diff);
  return formatDate(start);
};

export const getWeekEnd = (date: Date = new Date()): string => {
  const end = new Date(date);
  const day = end.getDay();
  const diff = end.getDate() + (6 - day); // Last day of week (Saturday)
  end.setDate(diff);
  return formatDate(end);
};

export const getMonthStart = (date: Date = new Date()): string => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return formatDate(start);
};

export const getMonthEnd = (date: Date = new Date()): string => {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return formatDate(end);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z');
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

export const getRelativeDay = (dateString: string): string => {
  if (isToday(dateString)) {
    return 'Today';
  } else if (isYesterday(dateString)) {
    return 'Yesterday';
  } else {
    return formatDisplayDate(parseDate(dateString));
  }
};

export const calculateSleepDuration = (bedtime: Date, wakeTime: Date): number => {
  let sleepStart = new Date(bedtime);
  let sleepEnd = new Date(wakeTime);
  
  // If wake time is before bedtime, assume it's the next day
  if (sleepEnd < sleepStart) {
    sleepEnd.setDate(sleepEnd.getDate() + 1);
  }
  
  const diffMs = sleepEnd.getTime() - sleepStart.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

export const formatSleepTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const createDateFromTimeString = (timeString: string, baseDate: Date = new Date()): Date => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period?.toLowerCase() === 'pm' && hours !== 12) {
    hour24 += 12;
  } else if (period?.toLowerCase() === 'am' && hours === 12) {
    hour24 = 0;
  }
  
  const date = new Date(baseDate);
  date.setHours(hour24, minutes, 0, 0);
  
  return date;
};
