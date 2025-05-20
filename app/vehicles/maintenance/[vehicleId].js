import {
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MaintenanceCard } from "../../../components/MaintenanceCard";
import React, { useEffect, useState } from "react";
import { getMaintenanceByVehicle } from "../../../services/vehicles/maintenance";

export default function Maintenance() {
  const { vehicleId } = useLocalSearchParams();
  const [groupedMaintenances, setGroupedMaintenances] = useState({});
  const router = useRouter();

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
        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname:
                "/vehicles/maintenance/typemaintenance/[VehicleMaintenanceEntry]",
              VehicleMaintenanceEntry: JSON.stringify(maintenance),
            })
          }
        >
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}>
            Mantenimiento correctivo
          </Text>
        </Pressable>
        {Object.entries(groupedMaintenances).map(([category, maintenances]) => (
          <View
            key={category}
            style={{ width: "100%", gap: 10, marginBottom: 10 }}
          >
            <Text style={styles.categoryTitle}>{category}</Text>
            {maintenances.map((maintenance) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname:
                      "/vehicles/maintenance/typemaintenance/[VehicleMaintenanceEntry]",
                    params: {
                      VehicleMaintenanceEntry: JSON.stringify(maintenance),
                    },
                  })
                }
              >
                <MaintenanceCard
                  key={maintenance.id}
                  maintenance={maintenance}
                />
              </Pressable>
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
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    color: "#282D86",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#282D86",
    width: 320,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
});
