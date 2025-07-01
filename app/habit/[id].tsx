import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Trash2, Edit } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '@/store/habitStore';
import CalendarView from '@/components/CalendarView';
import ProgressCircle from '@/components/ProgressCircle';
import StreakBadge from '@/components/StreakBadge';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getTodayFormatted } from '@/utils/dateUtils';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useColorScheme();
  const habit = useHabitStore(state => state.getHabit(id));
  const toggleHabitCompletion = useHabitStore(state => state.toggleHabitCompletion);
  const deleteHabit = useHabitStore(state => state.deleteHabit);
  
  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Habit not found
        </Text>
      </View>
    );
  }
  
  const today = getTodayFormatted();
  const isCompletedToday = habit.completions[today];
  
  const handleToggleToday = () => {
    toggleHabitCompletion(habit.id, today);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          }
        }
      ]
    );
  };
  
  // Calculate completion rate
  const totalDays = Object.keys(habit.completions).length;
  const completedDays = Object.values(habit.completions).filter(Boolean).length;
  const completionRate = totalDays > 0 ? completedDays / totalDays : 0;
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: habit.name,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
          },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable 
                onPress={() => router.push(`/edit-habit/${habit.id}`)}
                style={({ pressed }) => [
                  styles.headerButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Edit size={20} color={colors.text} />
              </Pressable>
              <Pressable 
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.headerButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Trash2 size={20} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.gradient.background}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[habit.color, habit.color + 'DD']}
              style={[
                styles.iconContainer,
                {
                  ...Platform.select({
                    ios: {
                      shadowColor: habit.color,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                    },
                    android: {
                      elevation: 12,
                    },
                    web: {
                      boxShadow: `0px 8px 32px ${habit.color}60`,
                    },
                  }),
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>{habit.icon}</Text>
            </LinearGradient>
            
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Frequency
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {habit.frequency.type === 'daily' ? 'Daily' : 'Weekly'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Current Streak
                </Text>
                <StreakBadge streak={habit.streak} size="medium" />
              </View>
              
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Time of Day
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {habit.timeOfDay ? 
                    habit.timeOfDay.charAt(0).toUpperCase() + habit.timeOfDay.slice(1) : 
                    'Anytime'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today</Text>
          <Pressable
            style={({ pressed }) => [
              styles.todayButton,
              {
                opacity: pressed ? 0.95 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                ...Platform.select({
                  ios: {
                    shadowColor: isCompletedToday ? colors.primary : colors.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: isCompletedToday ? 0.3 : 0.1,
                    shadowRadius: 16,
                  },
                  android: {
                    elevation: isCompletedToday ? 12 : 6,
                  },
                  web: {
                    boxShadow: isCompletedToday 
                      ? `0px 8px 32px ${colors.primary}40` 
                      : `0px 4px 16px ${colors.shadow}`,
                  },
                }),
              }
            ]}
            onPress={handleToggleToday}
          >
            <LinearGradient
              colors={isCompletedToday ? colors.gradient.primary : colors.gradient.card}
              style={[
                styles.todayButtonGradient,
                !isCompletedToday && { 
                  borderWidth: 2, 
                  borderColor: colors.primary 
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[
                styles.todayButtonText,
                { color: isCompletedToday ? '#FFFFFF' : colors.primary }
              ]}>
                {isCompletedToday ? 'Completed ✓' : 'Mark as Complete'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Last 7 Days
          </Text>
          <CalendarView habit={habit} days={7} />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ProgressCircle 
                progress={completionRate} 
                size={100}
                strokeWidth={12}
                showPercentage
                animated={true}
              />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completion Rate
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[
                styles.statValueContainer, 
                { 
                  backgroundColor: colors.card,
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    },
                    android: {
                      elevation: 6,
                    },
                    web: {
                      boxShadow: `0px 4px 16px ${colors.shadow}`,
                    },
                  }),
                }
              ]}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {completedDays}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Days Completed
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[
                styles.statValueContainer, 
                { 
                  backgroundColor: colors.card,
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    },
                    android: {
                      elevation: 6,
                    },
                    web: {
                      boxShadow: `0px 4px 16px ${colors.shadow}`,
                    },
                  }),
                }
              ]}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  {habit.streak}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Current Streak
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  todayButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  todayButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  todayButtonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValueContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});