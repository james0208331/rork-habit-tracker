import React, { useRef } from 'react';
import { Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FloatingActionButtonProps {
  onPress: () => void;
  size?: number;
}

export default function FloatingActionButton({ 
  onPress, 
  size = 64 
}: FloatingActionButtonProps) {
  const { colors } = useColorScheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowValue = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    // Subtle breathing glow animation
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();
    
    return () => breathingAnimation.stop();
  }, []);
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
          transform: [
            { scale: scaleValue },
            { scale: glowValue }
          ],
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
            },
            android: {
              elevation: 16,
            },
            web: {
              boxShadow: `0px 12px 40px ${colors.primary}60, 0px 0px 20px ${colors.primary}30`,
            },
          }),
        }
      ]}
    >
      <Pressable
        style={[styles.button, { borderRadius: size / 2 }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors.gradient.primary}
          style={[
            styles.gradient, 
            { 
              width: size,
              height: size,
              borderRadius: size / 2 
            }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={3} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});