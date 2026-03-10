import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

interface WarningCardProps {
  message: string;
}

const WarningCard = ({ message }: WarningCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.warningText}>
        {" "}
        <Ionicons name="warning" size={24} color={colors.error} /> Atención
      </Text>
      <Text style={styles.cardText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 20,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.error,
  },
  cardText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

export default WarningCard;
