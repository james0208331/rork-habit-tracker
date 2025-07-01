import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '@/store/habitStore';
import ProgressCircle from '@/components/ProgressCircle';
import StreakBadge from '@/components/StreakBadge';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StatsScreen() {
  const { colors } = useColorScheme();
  const habits = useHabitStore(state => state.habits);
  const completedToday = useHabitStore(state => state.getCompletedToday());
  
  const stats = useMemo(() => {
    if (habits.length === 0) {
      return {
        totalHabits: 0,
        completedToday: 0,
        completionRate: 0,
        longestStreak: 0,
        totalCompletions: 0,
      };
    }
    
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak));
    
    const totalCompletions = habits.reduce((sum, habit) => {
      return sum + Object.values(habit.completions).filter(Boolean).length;
    }, 0);
    
    return {
      totalHabits,
      completedToday,
      completionRate,
      longestStreak,
      totalCompletions,
    };
  }, [habits, completedToday]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Your Stats</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your progress over time
          </Text>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.gradient.primary}
          style={[
            styles.mainStatCard,
            {
              ...Platform.select({
                ios: {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.3,
                  shadowRadius: 24,
                },
                android: {
                  elevation: 16,
                },
                web: {
                  boxShadow: `0px 12px 40px ${colors.primary}40`,
                },
              }),
            }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.mainStatLabel}>Today's Progress</Text>
          <View style={styles.circleContainer}>
            <ProgressCircle 
              progress={stats.completionRate / 100} 
              size={140}
              strokeWidth={18}
              showPercentage
              animated={true}
            />
          </View>
          <Text style={styles.mainStatValue}>
            {stats.completedToday}/{stats.totalHabits} habits completed
          </Text>
        </LinearGradient>
        
        <View style={styles.row}>
          <LinearGradient
            colors={colors.gradient.secondary}
            style={[styles.statCard, styles.halfCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statLabel}>Longest Streak</Text>
            <Text style={styles.statLargeValue}>
              {stats.longestStreak}
            </Text>
            <Text style={styles.statSubtext}>days</Text>
          </LinearGradient>
          
          <View style={[
            styles.statCard, 
            styles.halfCard, 
            { 
              backgroundColor: colors.card,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                },
                android: {
                  elevation: 8,
                },
                web: {
                  boxShadow: `0px 8px 24px ${colors.shadow}`,
                },
              }),
            }
          ]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Completions
            </Text>
            <Text style={[styles.statLargeValue, { color: colors.primary }]}>
              {stats.totalCompletions}
            </Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
              times
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statCard, 
          { 
            backgroundColor: colors.card,
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: `0px 8px 24px ${colors.shadow}`,
              },
            }),
          }
        ]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Habits by Streak
          </Text>
          {habits.length > 0 ? (
            habits
              .sort((a, b) => b.streak - a.streak)
              .map(habit => (
                <View key={habit.id} style={styles.habitStreakRow}>
                  <View style={styles.habitInfo}>
                    <LinearGradient
                      colors={[habit.color, habit.color + 'DD']}
                      style={styles.habitIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.habitIconText}>{habit.icon}</Text>
                    </LinearGradient>
                    <Text 
                      style={[styles.habitName, { color: colors.text }]} 
                      numberOfLines={1}
                    >
                      {habit.name}
                    </Text>
                  </View>
                  <StreakBadge streak={habit.streak} size="medium" />
                </View>
              ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No habits added yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  mainStatCard: {
    borderRadius: 28,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  mainStatLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    opacity: 0.95,
    letterSpacing: -0.3,
  },
  circleContainer: {
    marginVertical: 20,
  },
  mainStatValue: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
    opacity: 0.95,
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 24,
    padding: 24,
  },
  halfCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.95,
    letterSpacing: -0.2,
  },
  statLargeValue: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  statSubtext: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.9,
    fontWeight: '600',
  },
  habitStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  habitIconText: {
    fontSize: 18,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    letterSpacing: -0.2,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
    fontWeight: '500',
  },
});