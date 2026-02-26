import { ScrollView, View, StyleSheet, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaintenanceCard } from "../../../components/MaintenanceCard";
import { Dropdown } from "../../../components/Dropdown";
import React, { useEffect, useState } from "react";
import { getGroupedMaintenancesForVehicle } from "../../../services/vehicles/maintenance";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { colors } from "../../../constants/colors";

export default function Maintenance() {
  const { vehicleId, modelId } = useLocalSearchParams();
  const [groupedMaintenances, setGroupedMaintenances] = useState({
    assigned: {},
    possible: {},
  });
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
    getGroupedMaintenancesForVehicle(modelId)
      .then((data) => {
        setGroupedMaintenances(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching maintenance", err);
        setError(err.message || "No se pudo cargar el mantenimiento");
        setGroupedMaintenances({ assigned: {}, possible: {} });
      })
      .finally(() => setLoading(false));
  }, [modelId]);

  const hasAssigned = Object.keys(groupedMaintenances.assigned).length > 0;
  const hasPossible = Object.keys(groupedMaintenances.possible).length > 0;
  const isEmpty = !hasAssigned && !hasPossible;

  const handleMaintenancePress = (maintenance) => {
    router.push({
      pathname:
        "/vehicles/maintenance/typemaintenance/[VehicleMaintenanceEntry]",
      params: {
        VehicleMaintenanceEntry: JSON.stringify(maintenance),
        vehicleId: vehicleId,
      },
    });
  };

  return (
    <ScreenLayout
      title="Mantenimiento del vehículo"
      loading={loading}
      error={
        isEmpty
          ? error || "No hay mantenimientos disponibles para este vehículo"
          : null
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Mantenimientos Asignados */}
        {hasAssigned && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mantenimientos Requeridos</Text>
            {Object.entries(groupedMaintenances.assigned).map(
              ([category, maintenances]) => (
                <Dropdown
                  key={`assigned-${category}`}
                  title={category}
                  defaultOpen={false}
                  icon="tool"
                  iconColor={colors.maintenance.assigned.icon}
                  iconBackgroundColor={
                    colors.maintenance.assigned.iconBackground
                  }
                >
                  {maintenances.map((maintenance) => (
                    <Pressable
                      key={maintenance.id}
                      style={styles.maintenanceWrapper}
                      onPress={() => handleMaintenancePress(maintenance)}
                    >
                      <MaintenanceCard maintenance={maintenance} />
                    </Pressable>
                  ))}
                </Dropdown>
              ),
            )}
          </View>
        )}

        {/* Mantenimientos Posibles */}
        {hasPossible && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitlePossible}>
              Otros Mantenimientos
            </Text>
            {Object.entries(groupedMaintenances.possible).map(
              ([category, maintenances]) => (
                <Dropdown
                  key={`possible-${category}`}
                  title={category}
                  defaultOpen={false}
                  icon="tool"
                  iconColor={colors.maintenance.possible.icon}
                  iconBackgroundColor={
                    colors.maintenance.possible.iconBackground
                  }
                >
                  {maintenances.map((maintenance) => (
                    <Pressable
                      key={maintenance.id}
                      style={styles.maintenanceWrapper}
                      onPress={() => handleMaintenancePress(maintenance)}
                    >
                      <MaintenanceCard maintenance={maintenance} />
                    </Pressable>
                  ))}
                </Dropdown>
              ),
            )}
          </View>
        )}
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray[400],
    paddingBottom: 8,
  },
  sectionTitlePossible: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray[400],
    paddingBottom: 8,
  },
  maintenanceWrapper: {
    width: "100%",
  },
});
