import { Card } from '@/components/ui/card';
import { theme } from '@/constants/theme';
import sleepLogService from '@/services/mockSleepLog';
import { ChartData, SleepLog } from '@/types';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface TrendsStats {
  averageScore: number;
  averageHours: number;
  totalLogs: number;
  scoreDistribution: { [key: number]: number };
  currentStreak: number;
  longestStreak: number;
}

export default function ExploreScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<TrendsStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<SleepLog[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    loadTrendsData();
  }, [selectedPeriod]);

  const loadTrendsData = async () => {
    setIsLoading(true);
    try {
      const userId = 'mock-user-id';
      
      // Load chart data, stats, streak info, and recent logs in parallel
      const [chartResult, statsResult, streakResult, logsResult] = await Promise.all([
        sleepLogService.getChartData(userId, selectedPeriod),
        sleepLogService.getSleepStatistics(userId, selectedPeriod),
        sleepLogService.getStreakInfo(userId),
        sleepLogService.getRecentSleepLogs(userId, 5), // Last 5 entries
      ]);

      setChartData(chartResult);
      setStats({
        ...statsResult,
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
      });
      setRecentLogs(logsResult);
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 1: return '#E57373';
      case 2: return '#FFB74D';
      case 3: return '#FFF176';
      case 4: return '#81C784';
      case 5: return '#4CAF50';
      default: return theme.colors.primary.lavender;
    }
  };

  const getScoreEmoji = (score: number) => {
    switch (score) {
      case 1: return '😴';
      case 2: return '😪';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '💤';
    }
  };

  const generateInsights = (): string[] => {
    if (!stats || stats.totalLogs === 0) return [];
    
    const insights: string[] = [];
    
    if (stats.averageScore >= 4) {
      insights.push('🌟 Great sleep quality! Keep up the good habits.');
    } else if (stats.averageScore <= 2.5) {
      insights.push('💤 Your sleep quality could improve. Consider reviewing your bedtime routine.');
    }
    
    if (stats.averageHours < 7) {
      insights.push('⏰ You might benefit from more sleep. Aim for 7-9 hours per night.');
    } else if (stats.averageHours > 9) {
      insights.push('😴 You\'re getting plenty of sleep! Make sure it\'s quality rest.');
    }
    
    if (stats.currentStreak >= 7) {
      insights.push(`🔥 Amazing! You\'re on a ${stats.currentStreak}-day logging streak!`);
    } else if (stats.currentStreak >= 3) {
      insights.push(`📈 You\'re building a great habit with ${stats.currentStreak} days logged!`);
    }
    
    // Score distribution insights
    const mostCommonScore = Object.entries(stats.scoreDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommonScore && parseInt(mostCommonScore[0]) >= 4) {
      insights.push('✨ You consistently rate your sleep highly. Excellent!');
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  };

  const renderMiniChart = () => {
    if (chartData.length === 0) return null;
    
    const maxScore = 5;
    const maxHours = Math.max(...chartData.map(d => d.hours));
    const chartWidth = width - 80;
    const chartHeight = 120;
    const pointWidth = chartWidth / Math.max(chartData.length - 1, 1);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Sleep Trends</Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.primary.lavender }]} />
              <Text style={styles.legendText}>Quality</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.primary.deepNavy }]} />
              <Text style={styles.legendText}>Hours</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
          {/* Score line */}
          {chartData.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = chartData[index - 1];
            const x1 = (index - 1) * pointWidth;
            const y1 = chartHeight - (prevPoint.score / maxScore) * chartHeight;
            const x2 = index * pointWidth;
            const y2 = chartHeight - (point.score / maxScore) * chartHeight;
            
            return (
              <View
                key={`score-line-${index}`}
                style={[
                  styles.chartLine,
                  {
                    left: x1,
                    top: y1,
                    width: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
                    transform: [
                      { rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad` }
                    ],
                    backgroundColor: theme.colors.primary.lavender,
                  }
                ]}
              />
            );
          })}
          
          {/* Score points */}
          {chartData.map((point, index) => (
            <View
              key={`score-point-${index}`}
              style={[
                styles.chartPoint,
                {
                  left: index * pointWidth - 4,
                  top: chartHeight - (point.score / maxScore) * chartHeight - 4,
                  backgroundColor: theme.colors.primary.lavender,
                }
              ]}
            />
          ))}
        </View>
        
        <View style={styles.chartLabels}>
          {chartData.map((point, index) => (
            <Text key={index} style={styles.chartLabel}>
              {new Date(point.date).getDate()}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.lavender} />
          <Text style={styles.loadingText}>Loading your sleep trends...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const insights = generateInsights();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Trends</Text>
          <Text style={styles.subtitle}>
            Discover patterns in your sleep journey
          </Text>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {[7, 14, 30].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period as 7 | 14 | 30)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.averageScore.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Quality</Text>
                <Text style={styles.statEmoji}>{getScoreEmoji(Math.round(stats.averageScore))}</Text>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.averageHours.toFixed(1)}h</Text>
                <Text style={styles.statLabel}>Avg Hours</Text>
                <Text style={styles.statEmoji}>⏰</Text>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
                <Text style={styles.statEmoji}>🔥</Text>
              </View>
            </Card>
          </View>
        )}

        {/* Chart */}
        <Card style={styles.chartCard}>
          {renderMiniChart()}
        </Card>

        {/* Insights */}
        {insights.length > 0 && (
          <Card style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>💡 Sleep Insights</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Recent Entries */}
        {recentLogs.length > 0 && (
          <Card style={styles.recentCard}>
            <Text style={styles.recentTitle}>📝 Recent Entries</Text>
            {recentLogs.slice(0, 3).map((log) => (
              <View key={log.id} style={styles.recentEntry}>
                <View style={styles.recentEntryHeader}>
                  <View style={styles.recentEntryLeft}>
                    <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(log.score) }]}>
                      <Text style={styles.scoreBadgeText}>{log.score}</Text>
                    </View>
                    <View>
                      <Text style={styles.recentEntryDate}>
                        {new Date(log.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text style={styles.recentEntryHours}>{log.hours}h sleep</Text>
                    </View>
                  </View>
                </View>
                {log.journal && (
                  <Text style={styles.recentEntryJournal} numberOfLines={2}>
                    {log.journal}
                  </Text>
                )}
              </View>
            ))}
          </Card>
        )}
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
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: theme.colors.primary.offWhite,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary.lavender,
  },
  periodButtonText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  periodButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.h2,
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
  statEmoji: {
    fontSize: 20,
  },
  chartCard: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  chartContainer: {
    width: '100%',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  chart: {
    position: 'relative',
    marginBottom: 16,
  },
  chartLine: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  chartPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary.offWhite,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  chartLabel: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  insightsCard: {
    marginBottom: 20,
    backgroundColor: theme.colors.primary.deepNavy,
  },
  insightsTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.inverse,
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.inverse,
    lineHeight: 22,
  },
  recentCard: {
    marginBottom: 40,
  },
  recentTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  recentEntry: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.offWhite,
  },
  recentEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.inverse,
  },
  recentEntryDate: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  recentEntryHours: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  recentEntryJournal: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
