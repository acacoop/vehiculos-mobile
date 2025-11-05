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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getMaintenanceByVehicle(vehicleId)
      .then((data) => {
        const grouped = (data || []).reduce((acc, maintenance) => {
          if (!acc[maintenance.maintenanceCategoryName]) {
            acc[maintenance.maintenanceCategoryName] = [];
          }
          acc[maintenance.maintenanceCategoryName].push(maintenance);
          return acc;
        }, {});
        setGroupedMaintenances(grouped);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching maintenance", err);
        setError(err.message || "No se pudo cargar el mantenimiento");
        setGroupedMaintenances({});
      })
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (!groupedMaintenances || Object.keys(groupedMaintenances).length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>
          {error || "No hay mantenimientos asignados a este vehículo"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Mantenimiento del vehículo",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {Object.entries(groupedMaintenances).map(([category, maintenances]) => (
          <View
            key={category}
            style={{ width: "100%", gap: 10, marginBottom: 10 }}
          >
            <Text style={styles.categoryTitle}>{category}</Text>
            {maintenances.map((maintenance) => (
              <Pressable
                key={maintenance.id}
                style={styles.maintenanceWrapper}
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
                <MaintenanceCard maintenance={maintenance} />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          padding: 16,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: "#ddd",
          borderWidth: 1,
          zIndex: 10,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/vehicles/maintenance/typemaintenance/add-maintenance",
              params: {
                assignedMaintenanceId: "",
                maintenanceName: "Mantenimiento correctivo",
                maintenanceCategoryName: "Correctivo",
                kilometersFrequency: "",
              },
            })
          }
        >
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}>
            + Mantenimiento correctivo
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  scroll: {
    width: "100%",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "stretch",
    paddingHorizontal: "5%",
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
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
    backgroundColor: "#fe9000",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "center",
  },
  emptyText: {
    color: "#282D86",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  maintenanceWrapper: {
    width: "100%",
  },
});
