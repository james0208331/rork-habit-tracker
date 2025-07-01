import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun, Trash2, Info, Smartphone, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSettingsStore } from '@/store/settingsStore';
import { useHabitStore } from '@/store/habitStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { colorScheme, setColorScheme } = useSettingsStore();
  const { habits } = useHabitStore();
  const resetAllData = useHabitStore(state => state.resetAllData);
  
  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      `This will permanently delete all ${habits.length} habits and their progress. This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            resetAllData();
            Alert.alert("Success", "All data has been reset.");
          }
        }
      ]
    );
  };
  
  const handleColorSchemeChange = (scheme: 'auto' | 'light' | 'dark') => {
    setColorScheme(scheme);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
          },
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <ArrowLeft size={22} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary + '06', colors.secondary + '04']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Customize your experience
            </Text>
          </View>
        </LinearGradient>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance Section */}
          <View style={[
            styles.section,
            { 
              backgroundColor: colors.card,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 6,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadow}`,
                },
              }),
            }
          ]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
                {isDark ? (
                  <Moon size={20} color={colors.primary} />
                ) : (
                  <Sun size={20} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Theme
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Choose your preferred color scheme
              </Text>
            </View>
            
            <View style={styles.themeOptions}>
              {[
                { key: 'auto', label: 'Auto', icon: Smartphone },
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
              ].map(({ key, label, icon: Icon }) => (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.themeOption,
                    {
                      backgroundColor: colorScheme === key ? colors.primary : colors.backgroundSecondary,
                      borderColor: colorScheme === key ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                  onPress={() => handleColorSchemeChange(key as any)}
                >
                  <Icon 
                    size={18} 
                    color={colorScheme === key ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.themeOptionText,
                    { 
                      color: colorScheme === key ? '#FFFFFF' : colors.text,
                      fontWeight: colorScheme === key ? '600' : '500',
                    }
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Data Section */}
          <View style={[
            styles.section,
            { 
              backgroundColor: colors.card,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 6,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadow}`,
                },
              }),
            }
          ]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#FF6B6B20' }]}>
                <Trash2 size={20} color="#FF6B6B" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Data Management
              </Text>
            </View>
            
            <Pressable
              style={({ pressed }) => [
                styles.dangerButton,
                {
                  backgroundColor: pressed ? '#FF6B6B15' : 'transparent',
                  borderColor: '#FF6B6B',
                }
              ]}
              onPress={handleResetData}
            >
              <Trash2 size={18} color="#FF6B6B" />
              <View style={styles.dangerButtonText}>
                <Text style={[styles.settingLabel, { color: '#FF6B6B' }]}>
                  Reset All Data
                </Text>
                <Text style={[styles.settingDescription, { color: '#FF6B6B80' }]}>
                  Delete all habits and progress
                </Text>
              </View>
            </Pressable>
          </View>
          
          {/* About Section */}
          <View style={[
            styles.section,
            { 
              backgroundColor: colors.card,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 6,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadow}`,
                },
              }),
            }
          ]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Info size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About
              </Text>
            </View>
            
            <View style={styles.aboutContent}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.appIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.appIconText}>🎯</Text>
              </LinearGradient>
              
              <View style={styles.appInfo}>
                <Text style={[styles.appName, { color: colors.text }]}>
                  Habit Tracker
                </Text>
                <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
                  Build better habits, one day at a time. Track your progress and maintain streaks with this beautiful, minimal habit tracker.
                </Text>
                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
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
    paddingBottom: 40,
  },
  section: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  dangerButtonText: {
    flex: 1,
  },
  aboutContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 28,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  appDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  appVersion: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  backButton: {
    marginLeft: 16,
    padding: 4,
  },
});