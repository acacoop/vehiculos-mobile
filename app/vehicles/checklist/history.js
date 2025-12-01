import { Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { getVehicle } from "../../../services/vehicles";
import { getChecklistHistoryByVehicle } from "../../../services/maintenanceChecklists";
import { useState, useCallback } from "react";
import { HistoryCard } from "../../../components/HistoryCard";

export default function ChecklistHistory() {
  const { licensePlate } = useLocalSearchParams();

  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // First fetch the vehicle to get the vehicleId
      const vehicle = await getVehicle(licensePlate);
      if (!vehicle) {
        setError("Vehículo no encontrado");
        setVehicleDetail(null);
        setHistory([]);
        return;
      }

      setVehicleDetail(vehicle);

      // Then fetch the checklist history using the vehicleId
      const checklistHistory = await getChecklistHistoryByVehicle(vehicle.id);
      setHistory(checklistHistory);
      setError(null);
    } catch (err) {
      console.error("Error fetching data", err);
      setError(err.message || "No se pudo cargar el historial");
      setVehicleDetail(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [licensePlate]);

  // Refetch data every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{
            headerTitle: "Historial de Control",
            headerTitleAlign: "center",
          }}
        />
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen
          options={{
            headerTitle: "Historial de Control",
            headerTitleAlign: "center",
          }}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Historial de Control",
          headerTitleAlign: "center",
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.licensePlateTitle}>
            Dominio: {vehicleDetail?.licensePlate || licensePlate}
          </Text>
          <Text style={styles.subtitle}>
            {vehicleDetail?.brand && vehicleDetail?.model
              ? `${vehicleDetail.brand} ${vehicleDetail.model}`
              : "Marca y modelo desconocidos"}
          </Text>
        </View>

        <FlatList
          style={{ width: "90%", gap: 12 }}
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No hay registros de control para este vehículo.
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  header: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
  },
  licensePlateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#282D86",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A80A6",
  },
  listContainer: {
    width: "100%",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
});
