import {
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { MaintenanceCard } from "../../../components/MaintenanceCard";
import React, { useEffect, useState } from "react";
import { getMaintenanceByVehicle } from "../../../services/vehicles/maintenance";

export default function Maintenance() {
  const { vehicleId } = useLocalSearchParams();
  const [groupedMaintenances, setGroupedMaintenances] = useState({});

  useEffect(() => {
    getMaintenanceByVehicle(vehicleId).then((data) => {
      const grouped = data.reduce((acc, maintenance) => {
        if (!acc[maintenance.maintenanceCategoryName]) {
          acc[maintenance.maintenanceCategoryName] = [];
        }
        acc[maintenance.maintenanceCategoryName].push(maintenance);
        return acc;
      }, {});
      setGroupedMaintenances(grouped);
    });
  }, [vehicleId]);

  if (!groupedMaintenances || Object.keys(groupedMaintenances).length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Mantenimiento del vehículo" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(groupedMaintenances).map(([category, maintenances]) => (
          <View key={category} style={{ width: "100%" }}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {maintenances.map((maintenance) => (
              <MaintenanceCard key={maintenance.id} maintenance={maintenance} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    alignItems: "center",
    gap: 30,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#282D86",
  },
});
