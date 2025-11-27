// Color palette for the application

export const colors = {
  // Brand colors
  primary: "#282D86",
  secondary: "#fe9000",

  // Status colors
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",

  // Text colors
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  textLight: "#9ca3af",
  textWhite: "#ffffff",

  // Background colors
  background: "#ffffff",
  backgroundLight: "#f9fafb",
  backgroundDark: "#111827",

  // Border colors
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  borderDark: "#d1d5db",

  // Neutral colors
  black: "#000000",
  white: "#ffffff",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Semantic colors
  disabled: "#d1d5db",
  placeholder: "#9ca3af",
  link: "#3b82f6",
  linkHover: "#2563eb",
} as const;

export type ColorKeys = keyof typeof colors;
