import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;
  const dartAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // Icon fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      // Dart animation
      Animated.timing(dartAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Gentle pulse animation
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Tagline fade in
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hold for a moment, then exit
      setTimeout(() => {
        Animated.timing(exitAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 800);
    });
  }, []);
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: colors.background,
          opacity: exitAnim,
        }
      ]}
    >
      {/* Background gradient pattern */}
      <LinearGradient
        colors={[
          colors.primary + '08',
          colors.secondary + '06',
          colors.primary + '04',
          'transparent'
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle radial pattern */}
      <View style={[
        styles.radialPattern,
        {
          backgroundColor: colors.primary + '03',
        }
      ]} />
      
      <View style={styles.content}>
        {/* App Icon Container */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) }
              ],
              ...Platform.select({
                ios: {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.3,
                  shadowRadius: 30,
                },
                android: {
                  elevation: 20,
                },
                web: {
                  boxShadow: `0px 20px 60px ${colors.primary}40`,
                },
              }),
            }
          ]}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#EC4899']}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Target Icon */}
            <View style={styles.targetContainer}>
              {/* Outer ring */}
              <View style={[styles.targetRing, styles.outerRing]} />
              {/* Middle ring */}
              <View style={[styles.targetRing, styles.middleRing]} />
              {/* Inner ring */}
              <View style={[styles.targetRing, styles.innerRing]} />
              {/* Bullseye */}
              <View style={styles.bullseye} />
              
              {/* Dart */}
              <Animated.View
                style={[
                  styles.dartContainer,
                  {
                    opacity: dartAnim,
                    transform: [
                      {
                        translateX: dartAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        })
                      },
                      {
                        translateY: dartAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-30, 0],
                        })
                      },
                      { rotate: '45deg' }
                    ]
                  }
                ]}
              >
                {/* Dart body */}
                <View style={styles.dartBody} />
                {/* Dart tip */}
                <View style={styles.dartTip} />
                {/* Dart flights */}
                <View style={styles.dartFlights}>
                  <View style={[styles.dartFlight, styles.dartFlight1]} />
                  <View style={[styles.dartFlight, styles.dartFlight2]} />
                </View>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* App Name */}
        <Animated.Text
          style={[
            styles.appName,
            {
              color: colors.text,
              opacity: fadeAnim,
            }
          ]}
        >
          Habit Tracker
        </Animated.Text>
        
        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              color: colors.textSecondary,
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }
              ]
            }
          ]}
        >
          Build Better Habits
        </Animated.Text>
        
        {/* Subtle loading indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            { opacity: taglineAnim }
          ]}
        >
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: colors.primary,
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.05],
                      outputRange: [0.3, 0.8],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [1, 1.05],
                          outputRange: [0.8, 1],
                        })
                      }
                    ]
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  radialPattern: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%',
    height: '60%',
    borderRadius: 1000,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 32,
    borderRadius: 40,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  targetRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  outerRing: {
    width: 70,
    height: 70,
    backgroundColor: '#EF4444',
  },
  middleRing: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
  },
  innerRing: {
    width: 30,
    height: 30,
    backgroundColor: '#EF4444',
  },
  bullseye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  dartContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dartBody: {
    width: 20,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
    position: 'absolute',
  },
  dartTip: {
    width: 8,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    position: 'absolute',
    left: 16,
  },
  dartFlights: {
    position: 'absolute',
    right: 0,
    width: 12,
    height: 12,
  },
  dartFlight: {
    position: 'absolute',
    width: 8,
    height: 4,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  dartFlight1: {
    top: 2,
    transform: [{ rotate: '15deg' }],
  },
  dartFlight2: {
    bottom: 2,
    transform: [{ rotate: '-15deg' }],
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});