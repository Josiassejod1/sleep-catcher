import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { theme } from '@/constants/theme';
import openaiService from '@/services/mockOpenai';
import sleepLogService from '@/services/mockSleepLog';
import { formatDate } from '@/utils/date';
import { validateJournalEntry } from '@/utils/validation';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function JournalScreen() {
  const [prompt, setPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sleepScore, setSleepScore] = useState(3);
  const [wordCount, setWordCount] = useState(0);
  const [isPremium] = useState(false); // TODO: Get from subscription service

  const today = formatDate(new Date());
  const maxWords = isPremium ? Infinity : 100;

  useEffect(() => {
    loadTodaysLog();
  }, []);

  useEffect(() => {
    if (sleepScore > 0) {
      generatePrompt();
    }
  }, [sleepScore]);

  useEffect(() => {
    const words = journalEntry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [journalEntry]);

  const loadTodaysLog = async () => {
    try {
      // TODO: Get current user ID from auth service
      const userId = 'mock-user-id';
      const log = await sleepLogService.getSleepLogByDate(userId, today);
      
      if (log) {
        setSleepScore(log.score);
        if (log.journal) {
          setJournalEntry(log.journal);
        }
        if (log.prompt) {
          setPrompt(log.prompt);
          setIsLoadingPrompt(false);
        }
      }
    } catch (error) {
      console.error('Error loading today\'s log:', error);
      setIsLoadingPrompt(false);
    }
  };

  const generatePrompt = async () => {
    setIsLoadingPrompt(true);
    try {
      const response = await openaiService.generateReflectionPrompt(sleepScore);
      setPrompt(response.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      // Use fallback prompt
      const fallbackResponse = await openaiService.generateReflectionPrompt(sleepScore);
      setPrompt(fallbackResponse.prompt);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const handleSave = async () => {
    const validation = validateJournalEntry(journalEntry, isPremium);
    
    if (!validation.isValid) {
      Alert.alert(
        'Journal Entry Too Long',
        `Your journal entry is ${validation.wordCount} words. Free users are limited to ${validation.maxWords} words. Upgrade to Premium for unlimited journaling.`,
        [
          { text: 'Edit Entry', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Get current user ID from auth service
      const userId = 'mock-user-id';
      const log = await sleepLogService.getSleepLogByDate(userId, today);
      
      if (log) {
        await sleepLogService.updateSleepLog(log.id, {
          journal: journalEntry.trim(),
          prompt: prompt,
        });

        Alert.alert(
          'Journal Saved! 📝',
          'Your reflection has been saved. Great job logging your sleep!',
          [
            { 
              text: 'View Trends', 
              onPress: () => router.push('/(tabs)/explore') 
            },
            { 
              text: 'Done', 
              onPress: () => router.push('/(tabs)') 
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Journaling?',
      'You can always add a reflection later from your sleep log history.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => router.push('/(tabs)'),
          style: 'destructive' 
        },
      ]
    );
  };

  const getPromptIcon = () => {
    if (sleepScore <= 2) return '💭'; // Stress/reflection
    if (sleepScore >= 4) return '✨'; // Gratitude/positive
    return '🤔'; // Neutral/observation
  };

  const getScoreColor = () => {
    switch (sleepScore) {
      case 1: return '#E57373';
      case 2: return '#FFB74D';
      case 3: return '#FFF176';
      case 4: return '#81C784';
      case 5: return '#4CAF50';
      default: return theme.colors.primary.lavender;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.primary.offWhite} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Reflection</Text>
          <Text style={styles.subtitle}>
            Take a moment to reflect on your sleep experience
          </Text>
        </View>

        {/* Sleep Score Display */}
        <Card style={[styles.scoreCard, { backgroundColor: getScoreColor() + '20' }]}>
          <View style={styles.scoreDisplay}>
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor() }]}>
              <Text style={styles.scoreText}>{sleepScore}</Text>
            </View>
            <Text style={styles.scoreLabel}>Your Sleep Quality</Text>
          </View>
        </Card>

        {/* AI Prompt */}
        <Card style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <Text style={styles.promptIcon}>{getPromptIcon()}</Text>
            <Text style={styles.promptTitle}>Reflection Prompt</Text>
          </View>
          
          {isLoadingPrompt ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={theme.colors.primary.lavender} />
              <Text style={styles.loadingText}>Generating your personal prompt...</Text>
            </View>
          ) : (
            <Text style={styles.promptText}>{prompt}</Text>
          )}
        </Card>

        {/* Journal Entry */}
        <Card style={styles.journalCard}>
          <View style={styles.journalHeader}>
            <Text style={styles.journalTitle}>Your Reflection</Text>
            <Text style={[
              styles.wordCount,
              wordCount > maxWords && styles.wordCountError
            ]}>
              {wordCount}{maxWords !== Infinity ? `/${maxWords}` : ''} words
            </Text>
          </View>
          
          <TextInput
            style={styles.journalInput}
            value={journalEntry}
            onChangeText={setJournalEntry}
            placeholder="Share your thoughts about your sleep, what affected it, or how you're feeling..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            textAlignVertical="top"
            maxLength={isPremium ? undefined : maxWords * 10} // Rough character limit
          />
          
          {!isPremium && wordCount > 80 && (
            <View style={styles.upgradeHint}>
              <Text style={styles.upgradeText}>
                📝 Upgrade to Premium for unlimited journaling
              </Text>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isSaving ? 'Saving...' : 'Save Reflection'}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving || isLoadingPrompt}
            size="large"
          />
          
          <Button
            title="Skip for Now"
            onPress={handleSkip}
            variant="outline"
            disabled={isSaving}
            style={styles.skipButton}
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
    lineHeight: 24,
  },
  scoreCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  scoreDisplay: {
    alignItems: 'center',
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.inverse,
  },
  scoreLabel: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  promptCard: {
    marginBottom: 20,
    backgroundColor: theme.colors.primary.deepNavy,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  promptTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.inverse,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.inverse,
    marginTop: 12,
  },
  promptText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.inverse,
    lineHeight: 24,
  },
  journalCard: {
    marginBottom: 30,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  journalTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
  },
  wordCount: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  wordCountError: {
    color: theme.colors.status.error,
  },
  journalInput: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    lineHeight: 24,
  },
  upgradeHint: {
    backgroundColor: theme.colors.primary.lavender,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.inverse,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  skipButton: {
    marginTop: 12,
  },
});
