import { theme } from '@/constants/theme';
import React from 'react';
import { PanGestureHandler, PanGestureHandlerGestureEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
    clamp,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

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
  const translateX = useSharedValue(0);
  const sliderWidth = 280;
  const thumbSize = 40;
  const trackHeight = 8;

  // Initialize position based on value
  React.useEffect(() => {
    const position = ((value - min) / (max - min)) * (sliderWidth - thumbSize);
    translateX.value = position;
  }, [value, min, max, sliderWidth, thumbSize]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newX = clamp(context.startX + event.translationX, 0, sliderWidth - thumbSize);
      translateX.value = newX;
      
      // Calculate the score
      const progress = newX / (sliderWidth - thumbSize);
      const newValue = Math.round(min + progress * (max - min));
      runOnJS(onValueChange)(newValue);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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
      
      <View style={styles.sliderContainer}>
        {/* Track */}
        <View style={[styles.track, { width: sliderWidth }]}>
          <View style={[styles.activeTrack, { backgroundColor: getScoreColor(value) }]} />
        </View>
        
        {/* Score markers */}
        <View style={[styles.markersContainer, { width: sliderWidth }]}>
          {[1, 2, 3, 4, 5].map((score) => (
            <View 
              key={score} 
              style={[
                styles.marker,
                { left: ((score - 1) / 4) * (sliderWidth - thumbSize) + thumbSize / 2 - 1 }
              ]} 
            />
          ))}
        </View>
        
        {/* Thumb */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle, { backgroundColor: getScoreColor(value) }]}>
            <Text style={styles.thumbText}>{value}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* Score labels */}
      <View style={[styles.labelsContainer, { width: sliderWidth }]}>
        {[1, 2, 3, 4, 5].map((score) => (
          <Text 
            key={score} 
            style={[
              styles.labelText,
              { 
                left: ((score - 1) / 4) * (sliderWidth - thumbSize) + thumbSize / 2 - 8,
                color: value === score ? getScoreColor(score) : theme.colors.text.secondary
              }
            ]}
          >
            {score}
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
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fonts.heading,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  sliderContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  track: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  activeTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    opacity: 0.3,
  },
  markersContainer: {
    position: 'absolute',
    top: 14,
    height: 12,
  },
  marker: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: theme.colors.text.secondary,
    opacity: 0.5,
  },
  thumb: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontFamily: theme.typography.fonts.bodyBold,
  },
  labelsContainer: {
    position: 'relative',
    height: 20,
  },
  labelText: {
    position: 'absolute',
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fonts.body,
    width: 16,
    textAlign: 'center',
  },
});
