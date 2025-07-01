import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import HabitCard from '@/components/HabitCard';
import EmptyState from '@/components/EmptyState';
import ProgressCircle from '@/components/ProgressCircle';
import FloatingActionButton from '@/components/FloatingActionButton';
import WeekCalendar from '@/components/WeekCalendar';
import MotivationalMessage from '@/components/MotivationalMessage';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HabitsScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const habits = useHabitStore(state => state.habits);
  const completedToday = useHabitStore(state => state.getCompletedToday());
  const totalHabits = habits.length;
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const progress = totalHabits > 0 ? completedToday / totalHabits : 0;
  
  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{
            headerRight: () => (
              <Pressable 
                onPress={() => router.push('/settings')}
                style={({ pressed }) => [
                  styles.settingsButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Settings size={22} color={colors.text} />
              </Pressable>
            ),
          }}
        />
        
        <WeekCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        <MotivationalMessage />
        
        <EmptyState />
        <FloatingActionButton onPress={() => router.push('/new-habit')} />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              onPress={() => router.push('/settings')}
              style={({ pressed }) => [
                styles.settingsButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Settings size={22} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      {/* Background Pattern */}
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary + '40', colors.background]}
        style={styles.backgroundPattern}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <WeekCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <MotivationalMessage />
      
      <LinearGradient
        colors={[colors.primary + '06', colors.secondary + '04']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <ProgressCircle 
              progress={progress} 
              size={120} 
              strokeWidth={16}
              animated={true}
            >
              <Text style={[styles.progressText, { color: colors.text }]}>
                {completedToday}/{totalHabits}
              </Text>
            </ProgressCircle>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Today's Progress
            </Text>
          </View>
        </View>
      </LinearGradient>
      
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitCard habit={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <FloatingActionButton onPress={() => router.push('/new-habit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  headerGradient: {
    paddingBottom: 32,
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  progressText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  progressLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
    letterSpacing: -0.2,
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },
  settingsButton: {
    marginRight: 16,
    padding: 4,
  },
});