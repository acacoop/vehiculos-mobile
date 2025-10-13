import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconArrowRigth } from "./Icons";

type CardConfigProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress?: PressableProps["onPress"];
};

export function CardConfig({
  title,
  description,
  icon,
  onPress,
}: CardConfigProps) {
  if (onPress) {
    return (
      <Pressable style={styles.card} onPress={onPress}>
        <View
          style={{
            width: "10%",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            backgroundColor: "#ebecf1ff",
            borderRadius: "100%",
          }}
        >
          {icon}
        </View>
        <View style={{ width: "70%" }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <IconArrowRigth size={20} />
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      <View
        style={{
          width: "10%",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          backgroundColor: "#ebecf1ff",
          borderRadius: "100%",
        }}
      >
        {icon}
      </View>
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <IconArrowRigth size={20} />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
