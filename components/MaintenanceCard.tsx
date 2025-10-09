import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Maintenance } from "../interfaces/maintenance";
import { IconArrowRigth } from "./Icons";
import { IconTool } from "./Icons";

type MaintenanceCardProps = { maintenance: Maintenance };
export function MaintenanceCard({ maintenance }: MaintenanceCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.containerCard}>
        <View style={styles.containerImage}>
          {/* <Image
            source={require("../assets/aceite.jpg")}
            style={{ width: 75, height: 75, borderRadius: 12 }}
          /> */}
          <IconTool size={40} />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.text}>{maintenance.maintenanceName}</Text>
        </View>
        <IconArrowRigth size={20} />
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
    margin: 10,
  },
  containerTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
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
    gap: 25,
    width: "90%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#0000006b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#c4c4c4ff",
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
    borderRadius: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 5,
  },
});
