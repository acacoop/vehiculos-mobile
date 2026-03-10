import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../constants/colors";

export type IconName = keyof typeof Ionicons.glyphMap;

type IconColorSet = {
  default: string;
  pressed?: string;
};

type IconPalette = Partial<Record<string, IconColorSet>>;

type BaseIconProps = {
  color?: string;
  onPress?: () => void;
  size?: number;
  style?: any;
  pressed?: boolean;
};

// Mapping for specific colors per icon type
const iconPalette: IconPalette = {
  car: { default: colors.primary, pressed: colors.secondary },
  calendar: { default: colors.black, pressed: colors.secondary },
  setting: { default: colors.primary, pressed: colors.secondary },
  home: { default: colors.primary },
  user: { default: colors.primary, pressed: colors.white },
  wallet: { default: colors.primary, pressed: colors.white },
  lock: { default: colors.black, pressed: colors.white },
  logout: { default: colors.white, pressed: colors.secondary },
  left: { default: colors.primary, pressed: colors.white },
  right: { default: colors.primary, pressed: colors.white },
  tool: { default: colors.primary, pressed: colors.white },
  "paper-clip": { default: colors.primary, pressed: colors.white },
  idcard: { default: colors.primary, pressed: colors.white },
  download: { default: colors.white, pressed: colors.primary },
  edit: { default: colors.primary, pressed: colors.white },
  "close-circle": { default: colors.white, pressed: colors.white },
  "file-text": { default: colors.primary, pressed: colors.white },
  question: { default: colors.primary, pressed: colors.white },
  "clock-circle": { default: colors.primary, pressed: colors.white },
  down: { default: colors.primary },
  up: { default: colors.primary },
  safety: { default: colors.primary },
  check: { default: colors.white },
  close: { default: colors.white },
  key: { default: colors.primary },
  bulb: { default: colors.primary },
  warning: { default: colors.secondary },
};

// Mapping from the old keys (or logical keys) to Ionicons names
// We use outline variants to avoid the "filled" issue
const iconNameMapping: Record<string, IconName> = {
  car: "car-outline",
  calendar: "calendar-outline",
  setting: "settings-outline",
  home: "home-outline",
  user: "person-outline",
  wallet: "wallet-outline",
  lock: "lock-closed-outline",
  logout: "log-out-outline",
  left: "chevron-back-outline",
  right: "chevron-forward-outline",
  tool: "construct-outline",
  "paper-clip": "attach-outline",
  idcard: "card-outline",
  download: "download-outline",
  edit: "create-outline",
  "close-circle": "close-circle-outline",
  "file-text": "document-text-outline",
  question: "help-circle-outline",
  "clock-circle": "time-outline",
  down: "chevron-down-outline",
  up: "chevron-up-outline",
  safety: "shield-checkmark-outline",
  check: "checkmark-outline",
  close: "close-outline",
  key: "key-outline",
  bulb: "bulb-outline",
  warning: "warning-outline",
  // Mappings from iconNameByKey in original file
  bulb1: "bulb-outline",
  shield: "shield-checkmark-outline",
  // Backward compatibility and new requests
  Safety: "shield-checkmark-outline",
  alerttriangle: "warning-outline",
  emergency: "medkit-outline",
  // Toast notification icons
  checkcircle: "checkmark-circle",
  closecircle: "close-circle",
  infocirlce: "information-circle",
};

const pickColor = (
  color: string | undefined,
  pressed: boolean | undefined,
  defaultColor: string,
  pressedColor?: string
) => {
  if (color) return color;
  if (pressed && pressedColor) return pressedColor;
  return defaultColor;
};

export type IconProps = BaseIconProps & {
  name: string; // We accept string to allow the logical names (e.g. 'car', 'home')
  defaultColor?: string;
  pressedColor?: string;
};

export const Icon: React.FC<IconProps> = ({
  name,
  color,
  onPress,
  pressed,
  size = 24,
  style,
  defaultColor,
  pressedColor,
}) => {
  // Get the actual Ionicon name or fallback to help-circle if not found
  const ioniconName = iconNameMapping[name] || (name as IconName);

  // Check if we have a palette for the logical name
  const palette = iconPalette[name] ?? { default: colors.primary };

  const resolvedDefault = defaultColor ?? palette.default;
  const resolvedPressed = pressedColor ?? palette.pressed;
  const resolvedColor = pickColor(
    color,
    pressed,
    resolvedDefault,
    resolvedPressed
  );

  return (
    <Ionicons
      name={ioniconName as IconName}
      size={size}
      color={resolvedColor}
      onPress={onPress}
      style={style}
    />
  );
};

Icon.displayName = "Icon";

export type IconRenderProps = {
  size?: number;
  color?: string;
  style?: any;
};

type IconComponentType = React.FC<IconRenderProps>;

// Kept for backward compatibility if used elsewhere
export const getIconByKey = (key: string): IconComponentType => {
  const IconByKey: IconComponentType = ({ size = 24, color, style }) => (
    <Icon name={key} size={size} color={color} style={style} />
  );
  IconByKey.displayName = `Icon(${key})`;
  return IconByKey;
};
