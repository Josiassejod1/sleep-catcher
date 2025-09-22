import { firebaseFirestore } from '../config/firebase';
import { ChartData, SleepLog } from '../types';

class SleepLogService {
  private collection = firebaseFirestore.collection('sleepLogs');

  // Create a new sleep log
  async createSleepLog(sleepLog: Omit<SleepLog, 'id' | 'createdAt'>): Promise<SleepLog> {
    try {
      const docRef = await this.collection.add({
        ...sleepLog,
        createdAt: new Date(),
      });

      const newLog: SleepLog = {
        id: docRef.id,
        ...sleepLog,
        createdAt: new Date(),
      };

      return newLog;
    } catch (error) {
      console.error('Error creating sleep log:', error);
      throw error;
    }
  }

  // Update an existing sleep log
  async updateSleepLog(id: string, updates: Partial<SleepLog>): Promise<void> {
    try {
      await this.collection.doc(id).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating sleep log:', error);
      throw error;
    }
  }

  // Get sleep log by date for a specific user
  async getSleepLogByDate(userId: string, date: string): Promise<SleepLog | null> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .where('date', '==', date)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as SleepLog;
    } catch (error) {
      console.error('Error getting sleep log by date:', error);
      throw error;
    }
  }

  // Get sleep logs for a user within a date range
  async getSleepLogs(
    userId: string, 
    startDate: string, 
    endDate: string,
    limit?: number
  ): Promise<SleepLog[]> {
    try {
      let query = this.collection
        .where('userId', '==', userId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date', 'desc');

      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as SleepLog[];
    } catch (error) {
      console.error('Error getting sleep logs:', error);
      throw error;
    }
  }

  // Get recent sleep logs (last 7 days for free users)
  async getRecentSleepLogs(userId: string, days: number = 7): Promise<SleepLog[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const endDateString = endDate.toISOString().split('T')[0];
      const startDateString = startDate.toISOString().split('T')[0];

      return await this.getSleepLogs(userId, startDateString, endDateString);
    } catch (error) {
      console.error('Error getting recent sleep logs:', error);
      throw error;
    }
  }

  // Get chart data for trends
  async getChartData(userId: string, days: number = 7): Promise<ChartData[]> {
    try {
      const sleepLogs = await this.getRecentSleepLogs(userId, days);
      
      return sleepLogs.map(log => ({
        date: log.date,
        score: log.score,
        hours: log.hours,
      })).reverse(); // Reverse to show oldest first for chart
    } catch (error) {
      console.error('Error getting chart data:', error);
      throw error;
    }
  }

  // Delete a sleep log
  async deleteSleepLog(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.error('Error deleting sleep log:', error);
      throw error;
    }
  }

  // Get sleep log statistics
  async getSleepStatistics(userId: string, days: number = 7): Promise<{
    averageScore: number;
    averageHours: number;
    totalLogs: number;
    scoreDistribution: { [key: number]: number };
  }> {
    try {
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
    } catch (error) {
      console.error('Error getting sleep statistics:', error);
      throw error;
    }
  }

  // Check if user has logged today
  async hasLoggedToday(userId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const log = await this.getSleepLogByDate(userId, today);
      return log !== null;
    } catch (error) {
      console.error('Error checking if logged today:', error);
      return false;
    }
  }

  // Get streak information
  async getStreakInfo(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    try {
      // Get last 30 days of logs to calculate streak
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
    } catch (error) {
      console.error('Error getting streak info:', error);
      return { currentStreak: 0, longestStreak: 0 };
    }
  }
}

export default new SleepLogService();
