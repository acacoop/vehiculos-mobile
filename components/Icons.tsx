import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

type IconName = keyof typeof AntDesign.glyphMap;

type IconColorSet = {
  default: string;
  pressed?: string;
};

type IconPalette = Partial<Record<IconName, IconColorSet>>;

type BaseIconProps = {
  color?: string;
  onPress?: () => void;
  size?: number;
  style?: any;
  pressed?: boolean;
};

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
  paperclip: { default: "#282D86", pressed: "white" },
  idcard: { default: "#282D86", pressed: "white" },
  download: { default: "white", pressed: "#282D86" },
  edit: { default: "#282D86", pressed: "white" },
  closecircleo: { default: "white", pressed: "white" },
  filetext1: { default: "#282D86", pressed: "white" },
  question: { default: "#282D86", pressed: "white" },
  clockcircleo: { default: "#282D86", pressed: "white" },
  down: { default: "#282D86" },
  up: { default: "#282D86" },
  Safety: { default: "#282D86" },
  check: { default: "#FFFFFF" },
  close: { default: "#FFFFFF" },
  key: { default: "#282D86" },
  bulb1: { default: "#282D86" },
  warning: { default: "#FE9000" },
};

const pickColor = (
  color: string | undefined,
  pressed: boolean | undefined,
  defaultColor: string,
  pressedColor?: string
) => {
  if (color) {
    return color;
  }
  if (pressed && pressedColor) {
    return pressedColor;
  }
  return defaultColor;
};

export type IconProps = BaseIconProps & {
  name: IconName;
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
    <AntDesign
      name={name}
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

const iconNameByKey: Record<string, IconName> = {
  tool: "tool",
  bulb1: "bulb1",
  car: "car",
  safety: "Safety",
  shield: "Safety",
  warning: "warning",
  key: "key",
};

export const getIconByKey = (key: string): IconComponentType => {
  const iconName = iconNameByKey[key] ?? "Safety";
  const IconByKey: IconComponentType = ({ size = 24, color, style }) => (
    <Icon name={iconName} size={size} color={color} style={style} />
  );
  IconByKey.displayName = `Icon(${iconName})`;
  return IconByKey;
};
