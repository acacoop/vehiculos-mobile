// Color palette for the application

export const colors = {
  // Brand colors
  primary: "#282D86",
  primaryDark: "#1A237E",
  primaryLight: "#D0D4EB",
  primaryLightBg: "#EEF1FE",
  primaryMuted: "#9CA0C5",
  primaryHover: "#F6F7FF",
  primaryAlpha: "#282d8621",
  secondary: "#fe9000",

  // Status colors
  success: "#43A047",
  successLight: "#E8F5E9",
  error: "#E53935",
  errorDark: "#D32F2F",
  errorLight: "#FFEBEE",
  warning: "#FB8C00",
  warningLight: "#FFF3E0",
  info: "#039BE5",
  infoLight: "#E3F2FD",

  // Text colors
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  textLight: "#9ca3af",
  textWhite: "#ffffff",
  textDark: "#4A4A4A",
  textDarkAlt: "#424242",
  textMuted: "#8b8b8b",

  // Background colors
  background: "#ffffff",
  backgroundLight: "#f9fafb",
  backgroundDark: "#111827",
  backgroundPrimaryLight: "#F8F9FF",
  backgroundGray: "#f1f1f1",

  // Border colors
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  borderDark: "#d1d5db",
  borderExtraLight: "#F0F0F5",

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

  // Maintenance colors
  maintenance: {
    assigned: {
      icon: "#282D86", // colors.primary
      iconBackground: "#f9fafb",
      title: "#2E7D32",
      border: "#4CAF50",
    },
    possible: {
      icon: "#282D86", // colors.primary
      iconBackground: "#f9fafb",
      title: "#E65100",
      border: "#FF9800",
    },
  },

  // Shadow colors
  shadow: "#000000",
  shadowLight: "#00000022",
} as const;

export type ColorKeys = keyof typeof colors;
