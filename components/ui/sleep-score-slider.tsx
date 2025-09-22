import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SleepScoreSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const SleepScoreSlider: React.FC<SleepScoreSliderProps> = ({
  value,
  onValueChange,
  min = 1,
  max = 5,
}) => {
  const getScoreColor = (score: number) => {
    switch (score) {
      case 1: return '#E57373'; // Red
      case 2: return '#FFB74D'; // Orange  
      case 3: return '#FFF176'; // Yellow
      case 4: return '#81C784'; // Light Green
      case 5: return '#4CAF50'; // Green
      default: return theme.colors.primary.lavender;
    }
  };

  const getScoreEmoji = (score: number) => {
    switch (score) {
      case 1: return '😴';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😍';
      default: return '😐';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Okay';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Okay';
    }
  };

  return (
    <View style={styles.container}>
      {/* Score Display */}
      <View style={styles.scoreDisplay}>
        <Text style={[styles.scoreEmoji, { color: getScoreColor(value) }]}>
          {getScoreEmoji(value)}
        </Text>
        <Text style={[styles.scoreNumber, { color: getScoreColor(value) }]}>
          {value}
        </Text>
        <Text style={styles.scoreLabel}>
          {getScoreLabel(value)}
        </Text>
      </View>
      
      {/* Score Buttons */}
      <View style={styles.buttonsContainer}>
        {[1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={score}
            style={[
              styles.scoreButton,
              {
                backgroundColor: value === score ? getScoreColor(score) : '#F5F5F5',
                borderColor: value === score ? getScoreColor(score) : '#E0E0E0',
              }
            ]}
            onPress={() => onValueChange(score)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.scoreButtonText,
                {
                  color: value === score ? '#FFFFFF' : '#666666',
                  fontWeight: value === score ? '600' : '400',
                }
              ]}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Score Labels */}
      <View style={styles.labelsContainer}>
        {[
          { score: 1, label: 'Very Poor' },
          { score: 2, label: 'Poor' },
          { score: 3, label: 'Okay' },
          { score: 4, label: 'Good' },
          { score: 5, label: 'Excellent' },
        ].map(({ score, label }) => (
          <Text
            key={score}
            style={[
              styles.labelText,
              { color: value === score ? getScoreColor(score) : theme.colors.text.secondary }
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 32,
    fontFamily: theme.typography.fonts.heading,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  scoreButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreButtonText: {
    fontSize: 18,
    fontFamily: theme.typography.fonts.bodyBold,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.body,
    textAlign: 'center',
    flex: 1,
  },
});