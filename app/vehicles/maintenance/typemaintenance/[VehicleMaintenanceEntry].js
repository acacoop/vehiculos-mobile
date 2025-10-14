import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, Stack, useNavigation } from "expo-router";
import MaintenanceButton from "../../../../components/MaintenanceButton";
import { getMaintenanceRecordsByAssignedMaintenance } from "../../../../services/maintenanceRecords";
import { getCurrentUser } from "../../../../services/me";

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry } = useLocalSearchParams();
  const maintenance = JSON.parse(VehicleMaintenanceEntry);

  const navigation = useNavigation();

  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [userId, setUserId] = useState(null);

  const assignedMaintenanceId = maintenance?.id;

  const loadMaintenanceRecords = async (assignedId) => {
    setLoadingHistory(true);
    try {
      const records =
        await getMaintenanceRecordsByAssignedMaintenance(assignedId);
      setMaintenanceHistory(records);
      setHistoryError(null);
    } catch (error) {
      console.error("Error al cargar el historial de mantenimiento", error);
      setMaintenanceHistory([]);
      setHistoryError(
        error?.message || "No se pudo obtener el historial de mantenimiento"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (maintenance?.maintenanceName) {
      navigation.setOptions({
        title: maintenance.maintenanceName,
      });
    }
  }, [maintenance, navigation]);

  useEffect(() => {
    if (!assignedMaintenanceId) return;
    loadMaintenanceRecords(assignedMaintenanceId);
  }, [assignedMaintenanceId]);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const handleAddMaintenance = (entry) => {
    setMaintenanceHistory((prevHistory) => [entry, ...prevHistory]);
  };

  const formattedHistory = useMemo(() => {
    return maintenanceHistory.map((entry) => ({
      ...entry,
      dateLabel: entry.date?.toLocaleDateString?.() || "-",
    }));
  }, [maintenanceHistory]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Detalle del Mantenimiento",
          headerTitleAlign: "center",
        }}
      />
      <Text style={styles.categoryTitle}>{maintenance.maintenanceName}</Text>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.containerInfocar}>
          <View style={styles.rowEven}>
            <Text style={styles.textTitle}>Tipo de Mantenimiento:</Text>
            <Text style={styles.textInfo}>
              {maintenance.maintenanceCategoryName}
            </Text>
          </View>
          <View style={styles.rowOdd}>
            <Text style={styles.textTitle}>Kilómetros del mantenimiento:</Text>
            <Text style={styles.textInfo}>
              {maintenance.kilometersFrequency} km
            </Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Historial de Mantenimientos</Text>
          {loadingHistory ? (
            <ActivityIndicator size="small" color="#282D86" />
          ) : historyError ? (
            <Text style={styles.errorText}>{historyError}</Text>
          ) : formattedHistory.length === 0 ? (
            <Text style={styles.emptyHistoryText}>
              No hay registros de mantenimiento disponibles
            </Text>
          ) : (
            formattedHistory.map((entry) => (
              <View key={entry.id} style={styles.historyEntry}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    paddingBottom: 8,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    marginBottom: 8,
                  }}
                >
                  <Text style={styles.historyDate}>{entry.dateLabel}</Text>
                  <Text style={styles.historyKilometers}>
                    {entry.kilometers} km
                  </Text>
                </View>
                {entry.notes ? (
                  <Text style={styles.historyNotes}>
                    <span style={{ fontWeight: "bold" }}>Observación:</span>{" "}
                    {entry.notes}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <MaintenanceButton
        assignedMaintenanceId={assignedMaintenanceId}
        userId={userId}
        onAddMaintenance={handleAddMaintenance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#282D86",
  },
  containerInfocar: {
    backgroundColor: "#ffffff",
    marginBottom: 20,
    gap: 15,
    padding: 10,
    borderRadius: 8,
  },
  rowEven: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  rowOdd: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 16,
    gap: 10,
  },
  textInfo: {
    color: "#282D86",
    fontSize: 16,
    fontWeight: "600",
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginTop: 8,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: "#282D86",
    marginTop: 8,
  },
  historyEntry: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  historyDate: {
    fontSize: 16,
    color: "#282D86",
    fontWeight: "700",
  },
  historyKilometers: {
    fontSize: 16,
    color: "#a0a0a0ff",
    fontWeight: "600",
  },
  historyNotes: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
});
