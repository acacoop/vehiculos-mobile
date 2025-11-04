import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

type IconBaseProps = {
  color?: string;
  onPress?: () => void;
  size?: number;
  style?: any;
  pressed?: boolean;
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

export const IconCar = ({
  color,
  size = 24,
  style,
  pressed,
}: IconBaseProps) => {
  const resolvedColor = pickColor(color, pressed, "#282D86", "#FE9000");
  return (
    <AntDesign name="car" size={size} color={resolvedColor} style={style} />
  );
};

export const IconCalendar = ({
  color,
  onPress,
  size = 24,
  style,
  pressed,
}: IconBaseProps) => {
  const resolvedColor = pickColor(color, pressed, "black", "#FE9000");
  return (
    <AntDesign
      name="calendar"
      size={size}
      color={resolvedColor}
      onPress={onPress}
      style={style}
    />
  );
};

export const IconSetting = ({
  color,
  size = 24,
  style,
  pressed,
}: IconBaseProps) => {
  const resolvedColor = pickColor(color, pressed, "#282D86", "#FE9000");
  return (
    <AntDesign name="setting" size={size} color={resolvedColor} style={style} />
  );
};

export const IconHome = ({ color }: { color: string }) => {
  return <AntDesign name="home" size={24} color={color} />;
};

export const IconUser = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="user"
      size={20}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconWallet = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="wallet"
      size={20}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconLock = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="lock"
      size={20}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};

export const IconLogout = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="logout"
      size={20}
      color={props.pressed ? "#fe9000" : "#ffffff"}
      style={props.style}
    />
  );
};

export const IconArrowLeft = (props: {
  onPress?: () => void;
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="left"
      onPress={props.onPress}
      size={props.size || 50}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconArrowRigth = (props: {
  onPress?: () => void;
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="right"
      onPress={props.onPress}
      size={props.size || 50}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconTool = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="tool"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconClip = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="paperclip"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconIdCard = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="idcard"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconDownload = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="download"
      size={props.size || 25}
      color={props.pressed ? "#282D86" : "white"}
      style={props.style}
    />
  );
};

export const IconEdit = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="edit"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconClose = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="closecircleo"
      size={props.size || 25}
      color={props.pressed ? "white" : "white"}
      style={props.style}
    />
  );
};

export const IconFile = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="filetext1"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconQuestion = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="question"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconClock = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="clockcircleo"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export type IconRenderProps = {
  size?: number;
  color?: string;
  style?: any;
};

type IconComponentType = (props: IconRenderProps) => React.ReactElement;

export const IconChevronDown: IconComponentType = ({
  size = 24,
  color = "#282D86",
  style,
}) => <AntDesign name="down" size={size} color={color} style={style} />;

export const IconChevronUp: IconComponentType = ({
  size = 24,
  color = "#282D86",
  style,
}) => <AntDesign name="up" size={size} color={color} style={style} />;

export const IconShield: IconComponentType = ({
  size = 24,
  color = "#282D86",
  style,
}) => <AntDesign name="Safety" size={size} color={color} style={style} />;

export const IconCheck: IconComponentType = ({
  size = 20,
  color = "#FFFFFF",
  style,
}) => <AntDesign name="check" size={size} color={color} style={style} />;

export const IconCloseSmall: IconComponentType = ({
  size = 20,
  color = "#FFFFFF",
  style,
}) => <AntDesign name="close" size={size} color={color} style={style} />;

const iconNameByKey: Record<string, keyof typeof AntDesign.glyphMap> = {
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
  return ({ size = 24, color = "#282D86", style }) => (
    <AntDesign name={iconName} size={size} color={color} style={style} />
  );
};
