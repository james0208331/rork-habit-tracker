import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

const MOTIVATIONAL_MESSAGES = [
  "You've got this! Stay consistent. 💪",
  "Small steps, big results. 🚀",
  "Progress, not perfection. 🎯",
  "One day at a time. 💪",
  "Consistency is the key to success. 🔑",
  "Make today count. 🌟"
];

export default function MotivationalMessage() {
  const { colors } = useColorScheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const handlePress = () => {
    // Enhanced animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update message
      setCurrentIndex((prevIndex) => 
        prevIndex === MOTIVATIONAL_MESSAGES.length - 1 ? 0 : prevIndex + 1
      );
      
      // Reset slide position and animate in
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  return (
    <View style={[
      styles.container,
      {
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          },
          android: {
            elevation: 4,
          },
          web: {
            boxShadow: `0px 3px 16px ${colors.shadowLight}`,
          },
        }),
      }
    ]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.95 : 1 }
        ]}
      >
        <LinearGradient
          colors={[colors.primary + '08', colors.secondary + '06']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View 
            style={[
              styles.content,
              { 
                borderLeftColor: colors.primary,
                backgroundColor: colors.card + 'F5',
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            <Text style={[styles.message, { color: colors.text }]}>
              {MOTIVATIONAL_MESSAGES[currentIndex]}
            </Text>
            <Text style={[styles.tapHint, { color: colors.textSecondary }]}>
              Tap for more inspiration
            </Text>
          </Animated.View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressable: {
    borderRadius: 16,
  },
  gradient: {
    borderRadius: 16,
  },
  content: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderLeftWidth: 4,
    borderRadius: 16,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 24,
    marginBottom: 6,
  },
  tapHint: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.3,
  },
});