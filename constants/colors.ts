export default {
  light: {
    background: "#FFFFFF",
    backgroundSecondary: "#F8F9FA",
    card: "#FFFFFF",
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    primary: "#3B82F6", // Brighter blue
    primaryLight: "#60A5FA",
    secondary: "#F59E0B", // Brighter amber
    secondaryLight: "#FBBF24",
    success: "#10B981", // Brighter green
    border: "#E5E7EB",
    inactive: "#D1D5DB",
    shadow: "rgba(0, 0, 0, 0.08)",
    shadowLight: "rgba(0, 0, 0, 0.04)",
    gradient: {
      primary: ["#3B82F6", "#60A5FA"] as const,
      secondary: ["#F59E0B", "#FBBF24"] as const,
      background: ["#F8FAFC", "#F1F5F9"] as const,
      card: ["#FFFFFF", "#F8FAFC"] as const,
      success: ["#10B981", "#34D399"] as const,
    },
  },
  dark: {
    background: "#0F172A",
    backgroundSecondary: "#1E293B",
    card: "#1E293B",
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    primary: "#60A5FA", // Brighter for dark mode
    primaryLight: "#93C5FD",
    secondary: "#FBBF24", // Brighter amber
    secondaryLight: "#FCD34D",
    success: "#34D399", // Brighter green
    border: "#334155",
    inactive: "#475569",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowLight: "rgba(0, 0, 0, 0.15)",
    gradient: {
      primary: ["#60A5FA", "#93C5FD"] as const,
      secondary: ["#FBBF24", "#FCD34D"] as const,
      background: ["#0F172A", "#1E293B"] as const,
      card: ["#1E293B", "#334155"] as const,
      success: ["#34D399", "#6EE7B7"] as const,
    },
  }
};