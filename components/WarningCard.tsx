import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WarningCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.warningText}>⚠️ Atención</Text>
      <Text style={styles.cardText}>Este mantenimiento está vencido.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  cardText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

export default WarningCard;
