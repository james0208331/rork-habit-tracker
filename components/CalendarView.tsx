import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getLastNDays, formatDate, getDayName, getDayNumber } from '@/utils/dateUtils';
import { Habit } from '@/types/habit';

interface CalendarViewProps {
  habit: Habit;
  days?: number;
}

export default function CalendarView({ habit, days = 7 }: CalendarViewProps) {
  const { colors } = useColorScheme();
  const dateList = getLastNDays(days);
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dateList.map((date) => {
        const formattedDate = formatDate(date);
        const isCompleted = habit.completions[formattedDate];
        
        return (
          <View key={formattedDate} style={styles.dayContainer}>
            <Text style={[styles.dayName, { color: colors.textSecondary }]}>
              {getDayName(date)}
            </Text>
            <View style={[
              styles.dateContainer,
              {
                ...Platform.select({
                  ios: {
                    shadowColor: isCompleted ? colors.primary : colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isCompleted ? 0.3 : 0.1,
                    shadowRadius: isCompleted ? 8 : 4,
                  },
                  android: {
                    elevation: isCompleted ? 8 : 4,
                  },
                  web: {
                    boxShadow: isCompleted 
                      ? `0px 4px 16px ${colors.primary}40` 
                      : `0px 2px 8px ${colors.shadow}`,
                  },
                }),
              }
            ]}>
              {isCompleted ? (
                <LinearGradient
                  colors={colors.gradient.primary}
                  style={styles.completedCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.completedText}>
                    {getDayNumber(date)}
                  </Text>
                </LinearGradient>
              ) : (
                <View 
                  style={[
                    styles.dateCircle,
                    { 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }
                  ]}
                >
                  <Text style={[styles.dateNumber, { color: colors.text }]}>
                    {getDayNumber(date)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 48,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  dateContainer: {
    borderRadius: 24,
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  completedCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: 15,
    fontWeight: '700',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});