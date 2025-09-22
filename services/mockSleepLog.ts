import { ChartData, SleepLog } from '../types';
import { formatDate } from '../utils/date';

// Mock data for development
const mockSleepLogs: SleepLog[] = [
  {
    id: '1',
    userId: 'mock-user-id',
    date: formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)), // Yesterday
    score: 4,
    hours: 7.5,
    bedtime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000), // 8 hours ago yesterday
    wakeTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 min ago yesterday
    journal: "Had a great night's sleep! Felt very refreshed.",
    prompt: "What helped you sleep so well last night?",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: 'mock-user-id',
    date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
    score: 3,
    hours: 6.5,
    bedtime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000),
    wakeTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    journal: "Okay sleep, but felt a bit restless.",
    prompt: "What might have contributed to feeling restless?",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    userId: 'mock-user-id',
    date: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
    score: 5,
    hours: 8.0,
    bedtime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 8.5 * 60 * 60 * 1000),
    wakeTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    journal: "Perfect sleep! Went to bed early and woke up naturally.",
    prompt: "What are you grateful for about your sleep experience?",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    userId: 'mock-user-id',
    date: formatDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)), // 4 days ago
    score: 2,
    hours: 5.5,
    bedtime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    wakeTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    journal: "Had trouble falling asleep due to stress.",
    prompt: "What strategies could help you manage stress before bedtime?",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    userId: 'mock-user-id',
    date: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
    score: 4,
    hours: 7.0,
    bedtime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 7.5 * 60 * 60 * 1000),
    wakeTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    journal: "Good sleep overall, felt well-rested.",
    prompt: "How did good sleep impact your day?",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

class MockSleepLogService {
  private logs: SleepLog[] = [...mockSleepLogs];

  // Create a new sleep log
  async createSleepLog(sleepLog: Omit<SleepLog, 'id' | 'createdAt'>): Promise<SleepLog> {
    await this.delay(500); // Simulate network delay
    
    const newLog: SleepLog = {
      ...sleepLog,
      id: `mock-${Date.now()}`,
      createdAt: new Date(),
    };

    this.logs.unshift(newLog); // Add to beginning
    return newLog;
  }

  // Update an existing sleep log
  async updateSleepLog(id: string, updates: Partial<SleepLog>): Promise<void> {
    await this.delay(300);
    
    const index = this.logs.findIndex(log => log.id === id);
    if (index !== -1) {
      this.logs[index] = { ...this.logs[index], ...updates, updatedAt: new Date() };
    }
  }

  // Get sleep log by date for a specific user
  async getSleepLogByDate(userId: string, date: string): Promise<SleepLog | null> {
    await this.delay(200);
    
    const log = this.logs.find(log => log.userId === userId && log.date === date);
    return log || null;
  }

  // Get sleep logs for a user within a date range
  async getSleepLogs(
    userId: string, 
    startDate: string, 
    endDate: string,
    limit?: number
  ): Promise<SleepLog[]> {
    await this.delay(300);
    
    let filtered = this.logs.filter(log => 
      log.userId === userId && 
      log.date >= startDate && 
      log.date <= endDate
    );

    // Sort by date descending
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  // Get recent sleep logs (last 7 days for free users)
  async getRecentSleepLogs(userId: string, days: number = 7): Promise<SleepLog[]> {
    await this.delay(250);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const endDateString = endDate.toISOString().split('T')[0];
    const startDateString = startDate.toISOString().split('T')[0];

    return await this.getSleepLogs(userId, startDateString, endDateString);
  }

  // Get chart data for trends
  async getChartData(userId: string, days: number = 7): Promise<ChartData[]> {
    const sleepLogs = await this.getRecentSleepLogs(userId, days);
    
    return sleepLogs.map(log => ({
      date: log.date,
      score: log.score,
      hours: log.hours,
    })).reverse(); // Reverse to show oldest first for chart
  }

  // Delete a sleep log
  async deleteSleepLog(id: string): Promise<void> {
    await this.delay(200);
    
    const index = this.logs.findIndex(log => log.id === id);
    if (index !== -1) {
      this.logs.splice(index, 1);
    }
  }

  // Get sleep log statistics
  async getSleepStatistics(userId: string, days: number = 7): Promise<{
    averageScore: number;
    averageHours: number;
    totalLogs: number;
    scoreDistribution: { [key: number]: number };
  }> {
    const sleepLogs = await this.getRecentSleepLogs(userId, days);
    
    if (sleepLogs.length === 0) {
      return {
        averageScore: 0,
        averageHours: 0,
        totalLogs: 0,
        scoreDistribution: {},
      };
    }

    const totalScore = sleepLogs.reduce((sum, log) => sum + log.score, 0);
    const totalHours = sleepLogs.reduce((sum, log) => sum + log.hours, 0);
    
    const scoreDistribution: { [key: number]: number } = {};
    sleepLogs.forEach(log => {
      scoreDistribution[log.score] = (scoreDistribution[log.score] || 0) + 1;
    });

    return {
      averageScore: totalScore / sleepLogs.length,
      averageHours: totalHours / sleepLogs.length,
      totalLogs: sleepLogs.length,
      scoreDistribution,
    };
  }

  // Check if user has logged today
  async hasLoggedToday(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const log = await this.getSleepLogByDate(userId, today);
    return log !== null;
  }

  // Get streak information
  async getStreakInfo(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    const logs = await this.getRecentSleepLogs(userId, 30);
    
    if (logs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort by date descending
    const sortedLogs = logs.sort((a, b) => b.date.localeCompare(a.date));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    // Calculate current streak (consecutive days from today backwards)
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = sortedLogs[i].date;
      const expectedDate = checkDate.toISOString().split('T')[0];
      
      if (logDate === expectedDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    for (let i = 0; i < sortedLogs.length; i++) {
      tempStreak = 1;
      let nextDate = new Date(sortedLogs[i].date);
      
      for (let j = i + 1; j < sortedLogs.length; j++) {
        nextDate.setDate(nextDate.getDate() - 1);
        const expectedDate = nextDate.toISOString().split('T')[0];
        
        if (sortedLogs[j].date === expectedDate) {
          tempStreak++;
        } else {
          break;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    return { currentStreak, longestStreak };
  }

  // Helper method to simulate async operations
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockSleepLogService();
