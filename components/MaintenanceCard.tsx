import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Maintenance } from "../interfaces/maintenance";

type MaintenanceCardProps = { maintenance: Maintenance };
export function MaintenanceCard({ maintenance }: MaintenanceCardProps) {
  return (
    <View style={styles.containerCard}>
      <View style={styles.containerImage}>
        <Image
          source={require("../assets/aceite.jpg")}
          style={{ width: 75, height: 75, borderRadius: 8 }}
        />
      </View>
      <View style={styles.containerText}>
        <Text style={styles.text}>{maintenance.maintenanceName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  containerTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
  },
  tittle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 15,
    marginTop: 10,
  },
  text: {
    fontSize: 25,
    color: "#282D86",
  },
  containerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
    width: 300,
    height: 100,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  containerText: {
    flex: 1,
    color: "#000",
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
