import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Maintenance } from "../interfaces/maintenance";
import { Icon } from "./Icons";

type MaintenanceCardProps = { maintenance: Maintenance };
export function MaintenanceCard({ maintenance }: MaintenanceCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.containerCard}>
        <View style={styles.containerText}>
          <Text style={styles.text}>{maintenance.maintenanceName}</Text>
        </View>
        <Icon name="right" size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  containerTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  text: {
    fontSize: 16,
    color: "#1A237E",
    marginRight: 5,
    fontWeight: "600",
  },
  containerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 10,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  containerText: {
    flex: 1,
    color: "#000",
    marginRight: 10,
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 5,
  },
});
