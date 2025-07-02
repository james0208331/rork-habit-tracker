import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Flame, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StreakBadgeProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
}

export default function StreakBadge({ streak, size = 'small' }: StreakBadgeProps) {
  const { colors } = useColorScheme();
  
  if (streak === 0) return null;
  
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  
  const iconSize = isSmall ? 14 : isMedium ? 16 : 20;
  const fontSize = isSmall ? 12 : isMedium ? 14 : 16;
  const paddingHorizontal = isSmall ? 8 : isMedium ? 10 : 12;
  const paddingVertical = isSmall ? 4 : isMedium ? 6 : 8;
  const borderRadius = isSmall ? 12 : isMedium ? 14 : 16;
  
  // Use different icons based on streak length
  const IconComponent = streak >= 7 ? Award : Flame;
  const gradientColors = streak >= 7 ? (colors.gradient.success as any) : (colors.gradient.secondary as any);
  
  return (
    <View style={[
      styles.container,
      {
        borderRadius,
        ...Platform.select({
          ios: {
            shadowColor: streak >= 7 ? colors.success : colors.secondary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          },
          android: {
            elevation: 6,
          },
          web: {
            boxShadow: `0px 3px 12px ${streak >= 7 ? colors.success : colors.secondary}40`,
          },
        }),
      }
    ]}>
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.gradient,
          {
            paddingHorizontal,
            paddingVertical,
            borderRadius,
          }
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <IconComponent size={iconSize} color="#FFFFFF" strokeWidth={2} />
        <Text style={[styles.text, { fontSize }]}>
          {streak}
        </Text>
        <Text style={[styles.label, { fontSize: fontSize - 2 }]}>
          {streak === 1 ? 'day' : 'days'}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 4,
    marginRight: 2,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
});