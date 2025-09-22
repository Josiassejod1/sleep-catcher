import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SleepScoreSlider } from '@/components/ui/sleep-score-slider';
import { theme } from '@/constants/theme';
import healthService from '@/services/health';
import sleepLogService from '@/services/mockSleepLog';
import { formatDate } from '@/utils/date';
import { validateSleepHours, validateSleepScore } from '@/utils/validation';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function LogScreen() {
  const [score, setScore] = useState(3);
  const [hours, setHours] = useState('');
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);

  const today = formatDate(new Date());

  useEffect(() => {
    loadHealthData();
    checkExistingLog();
  }, []);

  const loadHealthData = async () => {
    try {
      const data = await healthService.getSleepData(new Date());
      if (data) {
        setHealthData(data);
        if (data.bedtime) {
          setBedtime(data.bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        if (data.wakeTime) {
          setWakeTime(data.wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        if (data.hoursSlept) {
          setHours(data.hoursSlept.toString());
        }
      }
    } catch (error) {
      console.log('Health data not available:', error);
      // Use mock data for development
      const mockData = healthService.getMockSleepData();
      setHealthData(mockData);
      setBedtime(mockData.bedtime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '');
      setWakeTime(mockData.wakeTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '');
      setHours(mockData.hoursSlept?.toString() || '');
    }
  };

  const checkExistingLog = async () => {
    try {
      // TODO: Get current user ID from auth service
      const userId = 'mock-user-id';
      const existingLog = await sleepLogService.getSleepLogByDate(userId, today);
      
      if (existingLog) {
        setScore(existingLog.score);
        setHours(existingLog.hours.toString());
        if (existingLog.bedtime) {
          setBedtime(existingLog.bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        if (existingLog.wakeTime) {
          setWakeTime(existingLog.wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (error) {
      console.error('Error checking existing log:', error);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!validateSleepScore(score)) {
      Alert.alert('Invalid Score', 'Please select a sleep quality score between 1 and 5.');
      return;
    }

    const hoursNum = parseFloat(hours);
    if (!hours || !validateSleepHours(hoursNum)) {
      Alert.alert('Invalid Hours', 'Please enter a valid number of hours slept (0-24).');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Get current user ID from auth service
      const userId = 'mock-user-id';
      
      // Check if log already exists for today
      const existingLog = await sleepLogService.getSleepLogByDate(userId, today);
      
      const logData = {
        userId,
        date: today,
        score,
        hours: hoursNum,
        bedtime: bedtime ? createTimeFromString(bedtime) : undefined,
        wakeTime: wakeTime ? createTimeFromString(wakeTime) : undefined,
      };

      if (existingLog) {
        await sleepLogService.updateSleepLog(existingLog.id, logData);
        Alert.alert('Success', 'Your sleep log has been updated!');
      } else {
        await sleepLogService.createSleepLog(logData);
        Alert.alert('Success', 'Your sleep log has been saved!');
      }

      // Navigate to journal/reflection screen
      router.push('/journal');
    } catch (error) {
      console.error('Error saving sleep log:', error);
      Alert.alert('Error', 'Failed to save your sleep log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createTimeFromString = (timeString: string): Date => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period?.toLowerCase() === 'pm' && hours !== 12) {
      hour24 += 12;
    } else if (period?.toLowerCase() === 'am' && hours === 12) {
      hour24 = 0;
    }
    
    const date = new Date();
    date.setHours(hour24, minutes, 0, 0);
    return date;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 18) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.primary.offWhite} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>How did you sleep?</Text>
        </View>

        <Card style={styles.scoreCard}>
          <SleepScoreSlider
            value={score}
            onValueChange={setScore}
          />
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Sleep Details</Text>
          
          <Input
            label="Hours Slept"
            value={hours}
            onChangeText={setHours}
            placeholder="7.5"
            suffix="hours"
            keyboardType="decimal-pad"
          />

          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Input
                label="Bedtime"
                value={bedtime}
                onChangeText={setBedtime}
                placeholder="10:30 PM"
              />
            </View>
            <View style={styles.timeInput}>
              <Input
                label="Wake Time"
                value={wakeTime}
                onChangeText={setWakeTime}
                placeholder="7:00 AM"
              />
            </View>
          </View>

          {healthData && (
            <View style={styles.healthDataBadge}>
              <Text style={styles.healthDataText}>
                📱 {healthData.source === 'manual' ? 'Sample data' : 'Synced from Health app'}
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Saving...' : 'Next'}
            onPress={handleSave}
            loading={isLoading}
            disabled={!hours || isLoading}
            size="large"
          />
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  scoreCard: {
    marginBottom: 20,
    backgroundColor: theme.colors.primary.peach,
  },
  detailsCard: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  healthDataBadge: {
    backgroundColor: theme.colors.primary.lavender,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  healthDataText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.inverse,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});
