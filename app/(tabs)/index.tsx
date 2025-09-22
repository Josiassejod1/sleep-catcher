import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { theme } from '@/constants/theme';
import sleepLogService from '@/services/mockSleepLog';
import { formatDate, getRelativeDay } from '@/utils/date';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DashboardStats {
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  averageHours: number;
  hasLoggedToday: boolean;
  todaysLog?: any;
}

export default function HomeScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    currentStreak: 0,
    longestStreak: 0,
    averageScore: 0,
    averageHours: 0,
    hasLoggedToday: false,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = formatDate(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Get current user ID from auth service
      const userId = 'mock-user-id';
      
      // Load stats
      const [streakInfo, sleepStats, hasLogged, todaysLog, logs] = await Promise.all([
        sleepLogService.getStreakInfo(userId),
        sleepLogService.getSleepStatistics(userId, 7),
        sleepLogService.hasLoggedToday(userId),
        sleepLogService.getSleepLogByDate(userId, today),
        sleepLogService.getRecentSleepLogs(userId, 5),
      ]);

      setStats({
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        averageScore: sleepStats.averageScore,
        averageHours: sleepStats.averageHours,
        hasLoggedToday: hasLogged,
        todaysLog,
      });

      setRecentLogs(logs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set mock data for development
      setStats({
        currentStreak: 5,
        longestStreak: 12,
        averageScore: 3.8,
        averageHours: 7.2,
        hasLoggedToday: false,
      });
      setRecentLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning!';
    if (hour < 18) return '☀️ Good afternoon!';
    return '🌙 Good evening!';
  };

  const getScoreColor = (score: number) => {
    switch (Math.round(score)) {
      case 1: return '#E57373';
      case 2: return '#FFB74D';
      case 3: return '#FFF176';
      case 4: return '#81C784';
      case 5: return '#4CAF50';
      default: return theme.colors.primary.lavender;
    }
  };

  const getScoreEmoji = (score: number) => {
    switch (Math.round(score)) {
      case 1: return '😴';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😍';
      default: return '😐';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your sleep data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.primary.offWhite} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>Ready to track your sleep?</Text>
        </View>

        {/* Quick Action */}
        {!stats.hasLoggedToday ? (
          <Card style={[styles.quickActionCard, { backgroundColor: theme.colors.primary.peach } as any]}>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Log Today's Sleep</Text>
              <Text style={styles.quickActionSubtitle}>
                How did you sleep last night?
              </Text>
              <Button
                title="Start Logging"
                onPress={() => router.push('/log')}
                style={styles.quickActionButton}
              />
            </View>
          </Card>
        ) : (
          <Card style={[styles.completedCard, { backgroundColor: theme.colors.status.success + '20' } as any]}>
            <View style={styles.completedContent}>
              <Text style={styles.completedEmoji}>✅</Text>
              <View>
                <Text style={styles.completedTitle}>Sleep Logged!</Text>
                <Text style={styles.completedSubtitle}>
                  Great job staying consistent
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={StyleSheet.flatten([styles.statCard, styles.statCardHalf])}>
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.statIcon}>🔥</Text>
            </Card>
            
            <Card style={StyleSheet.flatten([styles.statCard, styles.statCardHalf])}>
              <Text style={styles.statNumber}>{stats.averageScore.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Quality</Text>
              <Text style={styles.statIcon}>{getScoreEmoji(stats.averageScore)}</Text>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={StyleSheet.flatten([styles.statCard, styles.statCardHalf])}>
              <Text style={styles.statNumber}>{stats.averageHours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>Avg Sleep</Text>
              <Text style={styles.statIcon}>💤</Text>
            </Card>
            
            <Card style={StyleSheet.flatten([styles.statCard, styles.statCardHalf])}>
              <Text style={styles.statNumber}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Text style={styles.statIcon}>🏆</Text>
            </Card>
          </View>
        </View>

        {/* Recent Logs */}
        {recentLogs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sleep Logs</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentLogs.slice(0, 3).map((log, index) => (
              <Card key={log.id || index} style={styles.logCard}>
                <View style={styles.logContent}>
                  <View style={styles.logLeft}>
                    <Text style={styles.logDate}>
                      {getRelativeDay(log.date)}
                    </Text>
                    <Text style={styles.logDetails}>
                      {log.hours}h sleep
                    </Text>
                  </View>
                  <View style={styles.logRight}>
                    <View style={[
                      styles.scoreBadge,
                      { backgroundColor: getScoreColor(log.score) }
                    ]}>
                      <Text style={styles.scoreBadgeText}>{log.score}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.quickActionItemIcon}>📊</Text>
              <Text style={styles.quickActionItemText}>View Trends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/journal')}
            >
              <Text style={styles.quickActionItemIcon}>📝</Text>
              <Text style={styles.quickActionItemText}>Journal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.offWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  quickActionCard: {
    marginBottom: 24,
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  quickActionSubtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginBottom: 20,
  },
  quickActionButton: {
    minWidth: 150,
  },
  completedCard: {
    marginBottom: 24,
  },
  completedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  completedTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  completedSubtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statCardHalf: {
    flex: 1,
  },
  statNumber: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
  },
  viewAllButton: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.bodyBold,
    color: theme.colors.primary.lavender,
  },
  logCard: {
    marginBottom: 12,
  },
  logContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logLeft: {
    flex: 1,
  },
  logDate: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  logDetails: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  logRight: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBadgeText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.bodyBold,
    color: theme.colors.text.inverse,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: theme.colors.primary.offWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionItemIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionItemText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});
