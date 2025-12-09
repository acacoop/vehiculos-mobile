import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  car: { default: "#282D86", pressed: "#FE9000" },
  calendar: { default: "black", pressed: "#FE9000" },
  setting: { default: "#282D86", pressed: "#FE9000" },
  home: { default: "#282D86" },
  user: { default: "#282D86", pressed: "white" },
  wallet: { default: "#282D86", pressed: "white" },
  lock: { default: "black", pressed: "white" },
  logout: { default: "#ffffff", pressed: "#FE9000" },
  left: { default: "#282D86", pressed: "white" },
  right: { default: "#282D86", pressed: "white" },
  tool: { default: "#282D86", pressed: "white" },
  "paper-clip": { default: "#282D86", pressed: "white" },
  idcard: { default: "#282D86", pressed: "white" },
  download: { default: "white", pressed: "#282D86" },
  edit: { default: "#282D86", pressed: "white" },
  "close-circle": { default: "white", pressed: "white" },
  "file-text": { default: "#282D86", pressed: "white" },
  question: { default: "#282D86", pressed: "white" },
  "clock-circle": { default: "#282D86", pressed: "white" },
  down: { default: "#282D86" },
  up: { default: "#282D86" },
  safety: { default: "#282D86" },
  check: { default: "#FFFFFF" },
  close: { default: "#FFFFFF" },
  key: { default: "#282D86" },
  bulb: { default: "#282D86" },
  warning: { default: "#FE9000" },
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
  const palette = iconPalette[name] ?? { default: "#282D86" };

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
