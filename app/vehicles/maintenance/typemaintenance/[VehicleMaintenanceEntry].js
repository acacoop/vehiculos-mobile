import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, useNavigation } from "expo-router";
import MaintenanceButton from "../../../../components/MaintenanceButton";

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry } = useLocalSearchParams();
  const maintenance = JSON.parse(VehicleMaintenanceEntry);

  const navigation = useNavigation();

  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  useEffect(() => {
    if (maintenance?.maintenanceName) {
      navigation.setOptions({
        title: maintenance.maintenanceName,
      });
    }
  }, [maintenance, navigation]);

  const handleAddMaintenance = (entry) => {
    setMaintenanceHistory((prevHistory) => [...prevHistory, entry]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Detalle del Mantenimiento" }} />
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
            <Text style={styles.textTitle}>Kilómetros actuales:</Text>
            <Text style={styles.textInfo}>
              {maintenance.kilometersFrequency}
            </Text>
          </View>
        </View>

        {/* Historial de mantenimientos */}
        {maintenanceHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Historial de Mantenimientos</Text>
            {maintenanceHistory.map((entry, index) => (
              <View key={index} style={styles.historyEntry}>
                <Text style={styles.historyText}>Fecha: {entry.date}</Text>
                <Text style={styles.historyText}>
                  Descripción: {entry.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <MaintenanceButton onAddMaintenance={handleAddMaintenance} />
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
  },
  containerInfocar: {
    marginBottom: 20,
    gap: 10,
  },
  rowEven: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 8,
  },
  rowOdd: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 8,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textInfo: {
    color: "#333",
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyEntry: {
    backgroundColor: "#e0e0e0",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
});
