import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, Stack, useNavigation } from "expo-router";

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry } = useLocalSearchParams();
  const maintenance = JSON.parse(VehicleMaintenanceEntry);

  const navigation = useNavigation();

  useEffect(() => {
    if (maintenance?.maintenanceName) {
      navigation.setOptions({
        title: maintenance.maintenanceName,
      });
    }
  }, [maintenance, navigation]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Detalle del Mantenimiento" }} />
      <Text style={styles.categoryTitle}>{maintenance.maintenanceName}</Text>
      <Text>Kilometros: {maintenance.kilometersFrequency}</Text>
      <Text>Descripción: {maintenance.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#282D86",
  },
});
