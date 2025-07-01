import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  children?: React.ReactNode;
  animated?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressCircle({
  progress,
  size = 60,
  strokeWidth = 12,
  showPercentage = false,
  children,
  animated = true,
}: ProgressCircleProps) {
  const { colors } = useColorScheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    if (animated) {
      // Entrance animation
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
      
      // Progress animation
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
      scaleValue.setValue(1);
    }
  }, [progress, animated]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          width: size + 24, 
          height: size + 24,
          transform: [{ scale: scaleValue }]
        }
      ]}
    >
      {/* Enhanced background gradient with glow effect */}
      <ExpoLinearGradient
        colors={colors.gradient.background}
        style={[
          styles.backgroundGradient,
          {
            width: size + 24,
            height: size + 24,
            borderRadius: (size + 24) / 2,
          }
        ]}
      />
      
      {/* Soft inner shadow effect */}
      <View style={[
        styles.innerShadow,
        {
          width: size + 8,
          height: size + 8,
          borderRadius: (size + 8) / 2,
          backgroundColor: colors.card,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
            web: {
              boxShadow: `inset 0px 2px 8px ${colors.shadowLight}`,
            },
          }),
        }
      ]} />
      
      {/* Progress ring with enhanced shadow */}
      <View style={[
        styles.ringContainer,
        {
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
            },
            web: {
              filter: `drop-shadow(0px 6px 20px ${colors.primary}40)`,
            },
          }),
        }
      ]}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="50%" stopColor={colors.primaryLight} />
              <Stop offset="100%" stopColor={colors.primary} />
            </LinearGradient>
            <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.inactive} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={colors.inactive} stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          
          {/* Background circle with gradient */}
          <Circle
            stroke="url(#backgroundGradient)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle with enhanced gradient */}
          <AnimatedCircle
            stroke="url(#progressGradient)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
      </View>
      
      {/* Content with subtle glow */}
      <View style={styles.content}>
        {showPercentage ? (
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText, { color: colors.text }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        ) : (
          children
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    opacity: 0.8,
  },
  innerShadow: {
    position: 'absolute',
  },
  ringContainer: {
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});