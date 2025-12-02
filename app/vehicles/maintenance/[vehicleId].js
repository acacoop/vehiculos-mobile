import { ScrollView, View, StyleSheet, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaintenanceCard } from "../../../components/MaintenanceCard";
import React, { useEffect, useState } from "react";
import { getMaintenanceByVehicleModel } from "../../../services/vehicles/maintenance";
import { ScreenLayout } from "../../../components/ScreenLayout";

export default function Maintenance() {
  const { vehicleId, modelId } = useLocalSearchParams();
  const [groupedMaintenances, setGroupedMaintenances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!modelId) {
      setError("No se pudo obtener el modelo del vehículo");
      setLoading(false);
      return;
    }

    setLoading(true);
    getMaintenanceByVehicleModel(modelId)
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
  }, [modelId]);

  const isEmpty =
    !groupedMaintenances || Object.keys(groupedMaintenances).length === 0;

  return (
    <ScreenLayout
      title="Mantenimiento del vehículo"
      loading={loading}
      error={
        isEmpty
          ? error || "No hay mantenimientos asignados a este vehículo"
          : null
      }
    >
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
            Mantenimiento correctivo
          </Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
  },
  scrollContainer: {
    width: "90%",
    alignItems: "stretch",
    alignSelf: "center",
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",

    color: "#282D86",
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
  maintenanceWrapper: {
    width: "100%",
  },
});
