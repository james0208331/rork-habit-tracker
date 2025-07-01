import React from "react";
import { Tabs } from "expo-router";
import { Home, BarChart2 } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const { colors } = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingTop: 8,
          height: 88,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 8,
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          color: colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}