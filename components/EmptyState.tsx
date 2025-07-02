import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useColorScheme } from '@/hooks/useColorScheme';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "Start Your Journey",
  message = "Create your first habit and begin building a better you, one day at a time"
}: EmptyStateProps) {
  const router = useRouter();
  const { colors } = useColorScheme();
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background as any}
        style={[
          styles.backgroundGradient,
          {
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
              },
              android: {
                elevation: 12,
              },
              web: {
                boxShadow: `0px 12px 40px ${colors.shadow}`,
              },
            }),
          }
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={colors.gradient.primary as any}
              style={[
                styles.iconGradient,
                {
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                    },
                    android: {
                      elevation: 12,
                    },
                    web: {
                      boxShadow: `0px 8px 32px ${colors.primary}60`,
                    },
                  }),
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>🎯</Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backgroundGradient: {
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    maxWidth: 340,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.2,
  },
});