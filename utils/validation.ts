// Validation utility functions for Sleep Catcher

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSleepScore = (score: number): boolean => {
  return score >= 1 && score <= 5 && Number.isInteger(score);
};

export const validateSleepHours = (hours: number): boolean => {
  return hours >= 0 && hours <= 24 && !isNaN(hours);
};

export const validateJournalEntry = (entry: string, isPremium: boolean): {
  isValid: boolean;
  wordCount: number;
  maxWords: number;
} => {
  const words = entry.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const maxWords = isPremium ? Infinity : 100;
  
  return {
    isValid: wordCount <= maxWords,
    wordCount,
    maxWords: isPremium ? 0 : maxWords, // 0 means unlimited for premium
  };
};

export const validateDateString = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateTimeString = (timeString: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const validateDisplayName = (name: string): {
  isValid: boolean;
  error?: string;
} => {
  if (name.length === 0) {
    return { isValid: false, error: 'Name cannot be empty' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Name must be 50 characters or less' };
  }
  
  // Check for only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

export const validateBedtimeWakeTime = (bedtime: Date, wakeTime: Date): {
  isValid: boolean;
  error?: string;
} => {
  const now = new Date();
  
  // Check if times are in the future (more than 1 hour from now)
  if (bedtime > now || wakeTime > now) {
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (bedtime > oneHourFromNow || wakeTime > oneHourFromNow) {
      return { isValid: false, error: 'Sleep times cannot be too far in the future' };
    }
  }
  
  // Calculate sleep duration
  let sleepDuration: number;
  if (wakeTime < bedtime) {
    // Wake time is next day
    const nextDayWakeTime = new Date(wakeTime);
    nextDayWakeTime.setDate(nextDayWakeTime.getDate() + 1);
    sleepDuration = (nextDayWakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
  } else {
    sleepDuration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
  }
  
  // Check for reasonable sleep duration (30 minutes to 20 hours)
  if (sleepDuration < 0.5) {
    return { isValid: false, error: 'Sleep duration must be at least 30 minutes' };
  }
  
  if (sleepDuration > 20) {
    return { isValid: false, error: 'Sleep duration cannot exceed 20 hours' };
  }
  
  return { isValid: true };
};

export const validateExportDateRange = (startDate: string, endDate: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!validateDateString(startDate) || !validateDateString(endDate)) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (start > end) {
    return { isValid: false, error: 'Start date must be before end date' };
  }
  
  if (end > now) {
    return { isValid: false, error: 'End date cannot be in the future' };
  }
  
  // Check if date range is not too large (max 1 year)
  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays > 365) {
    return { isValid: false, error: 'Date range cannot exceed 1 year' };
  }
  
  return { isValid: true };
};

export const validateReminderTime = (timeString: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!validateTimeString(timeString)) {
    return { isValid: false, error: 'Invalid time format (use HH:MM)' };
  }
  
  return { isValid: true };
};

export const validateReminderDays = (days: number[]): {
  isValid: boolean;
  error?: string;
} => {
  if (!Array.isArray(days) || days.length === 0) {
    return { isValid: false, error: 'At least one day must be selected' };
  }
  
  // Check if all days are valid (0-6 for Sunday-Saturday)
  const validDays = days.every(day => Number.isInteger(day) && day >= 0 && day <= 6);
  if (!validDays) {
    return { isValid: false, error: 'Invalid day values (must be 0-6)' };
  }
  
  // Check for duplicates
  const uniqueDays = [...new Set(days)];
  if (uniqueDays.length !== days.length) {
    return { isValid: false, error: 'Duplicate days are not allowed' };
  }
  
  return { isValid: true };
};
