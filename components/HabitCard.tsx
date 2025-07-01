import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Habit } from '@/types/habit';
import { getTodayFormatted } from '@/utils/dateUtils';
import { useHabitStore } from '@/store/habitStore';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import StreakBadge from '@/components/StreakBadge';

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const { colors } = useColorScheme();
  const toggleHabitCompletion = useHabitStore(state => state.toggleHabitCompletion);
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const today = getTodayFormatted();
  const isCompleted = habit.completions[today];
  
  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };
  
  const handleToggle = () => {
    toggleHabitCompletion(habit.id, today);
  };
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
            },
            android: {
              elevation: 8,
            },
            web: {
              boxShadow: `0px 8px 32px ${colors.shadow}`,
            },
          }),
        }
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors.gradient.card}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[habit.color, habit.color + 'DD']}
                style={styles.icon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.iconText}>{habit.icon}</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {habit.name}
              </Text>
              <Text 
                style={[styles.description, { color: colors.textSecondary }]} 
                numberOfLines={1}
              >
                {habit.description}
              </Text>
              
              {habit.streak > 0 && (
                <View style={styles.streakContainer}>
                  <StreakBadge streak={habit.streak} />
                </View>
              )}
            </View>
            
            <AnimatedCheckbox
              checked={isCompleted}
              onPress={handleToggle}
              size={36}
            />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pressable: {
    borderRadius: 24,
  },
  cardGradient: {
    padding: 24,
    borderRadius: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },
  streakContainer: {
    alignSelf: 'flex-start',
  },
});