import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '@/store/habitStore';
import { useColorScheme } from '@/hooks/useColorScheme';

const ICONS = ['🏃', '💧', '📚', '🧘', '💪', '🥗', '💊', '😴', '🧠', '🎯'];
const COLORS = [
  '#6AADDF', // Light blue
  '#F8AFA6', // Light coral
  '#82C596', // Light green
  '#F9C784', // Light orange
  '#B39DDB', // Light purple
  '#81D4FA', // Sky blue
  '#FFD54F', // Light amber
  '#A5D6A7', // Light green
  '#E6EE9C', // Light lime
  '#FFAB91', // Light deep orange
];

const FREQUENCIES = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

const TIMES_OF_DAY = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Anytime', value: 'anytime' },
];

export default function NewHabitScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const addHabit = useHabitStore(state => state.addHabit);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime');
  
  const scaleValues = useRef(
    ICONS.reduce((acc, icon) => {
      acc[icon] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;
  
  const colorScaleValues = useRef(
    COLORS.reduce((acc, color) => {
      acc[color] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;
  
  const handleSave = () => {
    if (!name.trim()) {
      // Show error or validation message
      return;
    }
    
    addHabit({
      name,
      description,
      icon: selectedIcon,
      color: selectedColor,
      frequency: {
        type: frequency,
      },
      timeOfDay,
    });
    
    router.back();
  };
  
  const animateIconSelection = (icon: string) => {
    Animated.sequence([
      Animated.timing(scaleValues[icon], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValues[icon], {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedIcon(icon);
  };
  
  const animateColorSelection = (color: string) => {
    Animated.sequence([
      Animated.timing(colorScaleValues[color], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(colorScaleValues[color], {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedColor(color);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'New Habit',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
          },
          headerRight: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <X size={20} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary + '04', colors.secondary + '02']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information Card */}
          <View style={[
            styles.formCard,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 4,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadowLight}`,
                },
              }),
            }
          ]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Basic Information
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  }
                ]}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Drink water"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description (optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  }
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Drink 8 glasses of water daily"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          
          {/* Appearance Card */}
          <View style={[
            styles.formCard,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 4,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadowLight}`,
                },
              }),
            }
          ]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Appearance
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Choose an Icon</Text>
              <View style={styles.optionsGrid}>
                {ICONS.map((icon) => (
                  <Animated.View
                    key={icon}
                    style={[
                      styles.iconOptionContainer,
                      { transform: [{ scale: scaleValues[icon] }] }
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: selectedColor,
                          borderColor: selectedIcon === icon ? colors.primary : 'transparent',
                          borderWidth: selectedIcon === icon ? 3 : 0,
                          ...Platform.select({
                            ios: {
                              shadowColor: selectedIcon === icon ? colors.primary : colors.shadow,
                              shadowOffset: { width: 0, height: 6 },
                              shadowOpacity: selectedIcon === icon ? 0.4 : 0.15,
                              shadowRadius: selectedIcon === icon ? 12 : 6,
                            },
                            android: {
                              elevation: selectedIcon === icon ? 12 : 6,
                            },
                            web: {
                              boxShadow: selectedIcon === icon 
                                ? `0px 6px 20px ${colors.primary}50, 0px 0px 0px 3px ${colors.primary}` 
                                : `0px 3px 12px ${colors.shadow}`,
                            },
                          }),
                        }
                      ]}
                      onPress={() => animateIconSelection(icon)}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Pick a Color</Text>
              <View style={styles.optionsGrid}>
                {COLORS.map((color) => (
                  <Animated.View
                    key={color}
                    style={[
                      styles.colorOptionContainer,
                      { transform: [{ scale: colorScaleValues[color] }] }
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.colorOption,
                        { 
                          backgroundColor: color,
                          borderColor: selectedColor === color ? colors.text : 'transparent',
                          borderWidth: selectedColor === color ? 3 : 0,
                          ...Platform.select({
                            ios: {
                              shadowColor: selectedColor === color ? color : colors.shadow,
                              shadowOffset: { width: 0, height: 6 },
                              shadowOpacity: selectedColor === color ? 0.5 : 0.15,
                              shadowRadius: selectedColor === color ? 12 : 6,
                            },
                            android: {
                              elevation: selectedColor === color ? 12 : 6,
                            },
                            web: {
                              boxShadow: selectedColor === color 
                                ? `0px 6px 20px ${color}70, 0px 0px 0px 3px ${colors.text}` 
                                : `0px 3px 12px ${colors.shadow}`,
                            },
                          }),
                        }
                      ]}
                      onPress={() => animateColorSelection(color)}
                    />
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
          
          {/* Schedule Card */}
          <View style={[
            styles.formCard,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 4,
                },
                web: {
                  boxShadow: `0px 4px 20px ${colors.shadowLight}`,
                },
              }),
            }
          ]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Schedule
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
              <View style={styles.optionsRow}>
                {FREQUENCIES.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionButton,
                      frequency === item.value && styles.optionButtonSelected,
                      {
                        backgroundColor: frequency === item.value ? colors.primary : colors.backgroundSecondary,
                        borderColor: frequency === item.value ? colors.primary : colors.border,
                        ...Platform.select({
                          ios: frequency === item.value && {
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          },
                          android: frequency === item.value && {
                            elevation: 6,
                          },
                          web: frequency === item.value && {
                            boxShadow: `0px 4px 16px ${colors.primary}40`,
                          },
                        }),
                      }
                    ]}
                    onPress={() => setFrequency(item.value as 'daily' | 'weekly')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        { 
                          color: frequency === item.value ? '#FFFFFF' : colors.text,
                          fontWeight: frequency === item.value ? '700' : '500',
                        }
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Time of Day</Text>
              <View style={styles.optionsRow}>
                {TIMES_OF_DAY.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionButton,
                      timeOfDay === item.value && styles.optionButtonSelected,
                      {
                        backgroundColor: timeOfDay === item.value ? colors.secondary : colors.backgroundSecondary,
                        borderColor: timeOfDay === item.value ? colors.secondary : colors.border,
                        ...Platform.select({
                          ios: timeOfDay === item.value && {
                            shadowColor: colors.secondary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          },
                          android: timeOfDay === item.value && {
                            elevation: 6,
                          },
                          web: timeOfDay === item.value && {
                            boxShadow: `0px 4px 16px ${colors.secondary}40`,
                          },
                        }),
                      }
                    ]}
                    onPress={() => setTimeOfDay(item.value as any)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        { 
                          color: timeOfDay === item.value ? '#FFFFFF' : colors.text,
                          fontWeight: timeOfDay === item.value ? '700' : '500',
                        }
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { 
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                ...Platform.select({
                  ios: {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                  },
                  android: {
                    elevation: 12,
                  },
                  web: {
                    boxShadow: `0px 8px 32px ${colors.primary}40`,
                  },
                }),
              }
            ]}
            onPress={handleSave}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.saveButtonText}>Create Habit</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  input: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1.5,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  iconOptionContainer: {
    margin: 8,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  colorOptionContainer: {
    margin: 8,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 52,
    justifyContent: 'center',
  },
  optionButtonSelected: {
    transform: [{ scale: 1.02 }],
  },
  optionText: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
  },
  saveButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  closeButton: {
    marginRight: 16,
    padding: 4,
  },
});