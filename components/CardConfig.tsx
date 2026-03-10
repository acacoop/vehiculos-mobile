import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { Icon } from "./Icons";

type CardConfigProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress?: PressableProps["onPress"];
  showArrow?: boolean;
};

export function CardConfig({
  title,
  description,
  icon,
  onPress,
  showArrow = true,
}: CardConfigProps) {
  if (onPress) {
    return (
      <Pressable style={styles.card} onPress={onPress}>
        <View
          style={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            backgroundColor: colors.backgroundGray,
            borderRadius: "100%",
          }}
        >
          {icon}
        </View>
        <View style={{ width: "70%" }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {showArrow ? <Icon name="right" size={20} /> : <View style={{ width: 20 }} />}
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      <View
        style={{
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          backgroundColor: colors.backgroundGray,
          borderRadius: "100%",
        }}
      >
        {icon}
      </View>
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {showArrow ? <Icon name="right" size={20} /> : <View style={{ width: 20 }} />}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    borderBottomColor: colors.borderDark,
    borderBottomWidth: 1,
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
