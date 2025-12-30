import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BaseToast, ToastConfig } from "react-native-toast-message";
import { colors } from "../../constants/colors";
import { Icon } from "../Icons";

type ToastIconName = "checkcircle" | "closecircle" | "infocirlce" | "warning";

interface CustomToastProps {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  hide?: () => void;
}

const ToastIcon = ({
  type,
}: {
  type: "success" | "error" | "info" | "warning";
}) => {
  const iconConfig: Record<
    string,
    { name: ToastIconName; color: string; bgColor: string }
  > = {
    success: {
      name: "checkcircle",
      color: colors.success,
      bgColor: "#E8F5E9",
    },
    error: { name: "closecircle", color: colors.error, bgColor: "#FFEBEE" },
    info: { name: "infocirlce", color: colors.info, bgColor: "#E3F2FD" },
    warning: { name: "warning", color: colors.warning, bgColor: "#FFF3E0" },
  };

  const config = iconConfig[type];

  return (
    <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
      <Icon name={config.name} size={20} color={config.color} />
    </View>
  );
};

const CustomToast = ({
  type,
  text1,
  text2,
  onPress,
  hide,
}: CustomToastProps & { type: "success" | "error" | "info" | "warning" }) => {
  const borderColors: Record<string, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.info,
    warning: colors.warning,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.toastContainer,
        { borderLeftColor: borderColors[type] },
        pressed && { opacity: 0.9 },
      ]}
      onPress={onPress || hide}
    >
      <ToastIcon type={type} />
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
      <Pressable onPress={hide} style={styles.closeButton} hitSlop={10}>
        <Icon name="close" size={16} color={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
};

export const toastConfig: ToastConfig = {
  success: (props) => (
    <CustomToast
      type="success"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
      hide={props.hide}
    />
  ),
  error: (props) => (
    <CustomToast
      type="error"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
      hide={props.hide}
    />
  ),
  info: (props) => (
    <CustomToast
      type="info"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
      hide={props.hide}
    />
  ),
  warning: (props) => (
    <CustomToast
      type="warning"
      text1={props.text1}
      text2={props.text2}
      onPress={props.onPress}
      hide={props.hide}
    />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
});
