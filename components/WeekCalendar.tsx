import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatDate, getDayName, getDayNumber } from '@/utils/dateUtils';

interface WeekCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const { colors } = useColorScheme();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };
  
  const weekDates = getWeekDates(currentWeek);
  const today = new Date();
  const todayFormatted = formatDate(today);
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };
  
  const isToday = (date: Date) => {
    return formatDate(date) === todayFormatted;
  };
  
  const isSelected = (date: Date) => {
    return selectedDate && formatDate(date) === formatDate(selectedDate);
  };
  
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        ...Platform.select({
          ios: {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
          web: {
            boxShadow: `0px 2px 12px ${colors.shadowLight}`,
          },
        }),
      }
    ]}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => navigateWeek('prev')}
        >
          <ChevronLeft size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Text style={[styles.monthText, { color: colors.text }]}>
          {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => navigateWeek('next')}
        >
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
      >
        {weekDates.map((date, index) => {
          const isCurrentDay = isToday(date);
          const isSelectedDay = isSelected(date);
          
          return (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.dateItem,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => onDateSelect?.(date)}
            >
              <Text style={[
                styles.dayName,
                { color: colors.textSecondary }
              ]}>
                {getDayName(date)}
              </Text>
              
              <View style={styles.dateContainer}>
                {isCurrentDay || isSelectedDay ? (
                  <LinearGradient
                    colors={isCurrentDay ? colors.gradient.primary : colors.gradient.secondary}
                    style={styles.selectedDate}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.selectedDateText}>
                      {getDayNumber(date)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={[
                    styles.dateCircle,
                    { backgroundColor: 'transparent' }
                  ]}>
                    <Text style={[
                      styles.dateText,
                      { color: colors.text }
                    ]}>
                      {getDayNumber(date)}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  datesContainer: {
    paddingHorizontal: 12,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 44,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectedDateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});