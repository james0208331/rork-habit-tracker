import React, { useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Animated, View, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AnimatedCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
}

export default function AnimatedCheckbox({ 
  checked, 
  onPress, 
  size = 32 
}: AnimatedCheckboxProps) {
  const { colors } = useColorScheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: checked ? 1 : 0,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [checked]);
  
  const handlePress = () => {
    // Enhanced bounce animation with multiple stages
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounceValue, {
          toValue: 1.2,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [
            { scale: scaleValue },
            { scale: bounceValue }
          ],
          ...Platform.select({
            ios: {
              shadowColor: checked ? colors.primary : colors.border,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: checked ? 0.3 : 0.1,
              shadowRadius: checked ? 8 : 4,
            },
            android: {
              elevation: checked ? 8 : 4,
            },
            web: {
              boxShadow: checked 
                ? `0px 4px 16px ${colors.primary}40` 
                : `0px 2px 8px ${colors.shadow}`,
            },
          }),
        }
      ]}
    >
      <Pressable
        style={[styles.button, { borderRadius: size / 2 }]}
        onPress={handlePress}
        hitSlop={12}
      >
        {checked ? (
          <LinearGradient
            colors={colors.gradient.primary as any}
            style={[styles.checkedContainer, { borderRadius: size / 2 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View
              style={[
                styles.checkIcon,
                { transform: [{ scale: checkScale }] }
              ]}
            >
              <Check size={size * 0.6} color="#FFFFFF" strokeWidth={3.5} />
            </Animated.View>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.uncheckedContainer,
              {
                borderColor: colors.primary,
                borderRadius: size / 2,
                backgroundColor: colors.card,
              }
            ]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  checkedContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    backgroundColor: 'transparent',
  },
  checkIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});