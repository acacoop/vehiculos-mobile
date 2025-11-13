import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useLocalSearchParams,
  Stack,
  useNavigation,
  useRouter,
} from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getMaintenanceRecordsByAssignedMaintenance } from "../../../../services/maintenanceRecords";
import { Table } from "../../../../components/Table";

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry } = useLocalSearchParams();
  const maintenance = JSON.parse(VehicleMaintenanceEntry);

  const navigation = useNavigation();
  const router = useRouter();

  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const assignedMaintenanceId = maintenance?.id;

  const loadMaintenanceRecords = useCallback(async (assignedId) => {
    if (!assignedId) return;
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
        error?.message || "No se pudo obtener el historial de mantenimiento",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

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
  }, [assignedMaintenanceId, loadMaintenanceRecords]);

  useFocusEffect(
    useCallback(() => {
      if (!assignedMaintenanceId) return;
      loadMaintenanceRecords(assignedMaintenanceId);
    }, [assignedMaintenanceId, loadMaintenanceRecords]),
  );

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
          headerTitle: maintenance.maintenanceName,
          headerTitleAlign: "center",
        }}
      />

      <ScrollView
        style={{
          flex: 1,
          width: "90%",
          alignSelf: "center",
          paddingTop: 16,
        }}
      >
        <Table
          data={{
            Mantenimiento: maintenance.maintenanceCategoryName,
            "Frecuencia (km)":
              maintenance.kilometersFrequency ||
              maintenance.kilometersFrequency === 0
                ? `${maintenance.kilometersFrequency} km`
                : "-",
            "Frecuencia (días)":
              maintenance.daysFrequency || maintenance.daysFrequency === 0
                ? `${maintenance.daysFrequency} días`
                : "-",
          }}
        />

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
      <View
        style={{
          padding: 16,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: "#ddd",
          borderWidth: 1,
          zIndex: 10,
        }}
      >
        <Pressable
          style={[
            styles.addButton,
            !assignedMaintenanceId && styles.addButtonDisabled,
          ]}
          onPress={() =>
            router.push({
              pathname: "/vehicles/maintenance/typemaintenance/add-maintenance",
              params: {
                assignedMaintenanceId,
                maintenanceName: maintenance?.maintenanceName ?? "",
                maintenanceCategoryName:
                  maintenance?.maintenanceCategoryName ?? "",
                kilometersFrequency: String(
                  maintenance?.kilometersFrequency ?? "",
                ),
                daysFrequency: String(maintenance?.daysFrequency ?? ""),
              },
            })
          }
          disabled={!assignedMaintenanceId}
        >
          <Text style={styles.addButtonText}>
            {!assignedMaintenanceId
              ? "Mantenimiento no disponible"
              : "+ Registrar mantenimiento"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#282D86",
  },
  containerInfocar: {
    backgroundColor: "#ffffff",
    marginBottom: 20,
    gap: 15,
    padding: 10,
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
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
    backgroundColor: "#f1f1f1ff",
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
    color: "#282D86",
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
    borderRadius: 10,
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
  addButton: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
