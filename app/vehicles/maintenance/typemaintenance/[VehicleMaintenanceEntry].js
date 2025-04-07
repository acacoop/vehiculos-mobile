import { View, Text, StyleSheet, Pressable } from "react-native";
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
      <View style={styles.containerInfocar}>
        <View style={styles.rowEven}>
          <Text style={styles.textTitle}>Tipo de Mantenimiento:</Text>
          <Text style={styles.textInfo}>
            {maintenance.maintenanceCategoryName}
          </Text>
        </View>
        <View style={styles.rowOdd}>
          <Text style={styles.textTitle}>Kilómetros:</Text>
          <Text style={styles.textInfo}>{maintenance.kilometersFrequency}</Text>
        </View>
      </View>
      <View style={styles.containerButtons}>
        <Pressable
          style={styles.Pressable}
          onPress={() => alert("Actualización de mantenimiento")}
        >
          <Text style={styles.buttonText}>Actualización de mantenimiento</Text>
        </Pressable>
      </View>
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
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#282D86",
  },
  containerInfocar: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    padding: 16,
  },
  rowEven: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
  },
  rowOdd: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  textInfo: {
    fontSize: 18,
    color: "#282D86",
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  Pressable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    width: 250,
  },
  buttonText: {
    color: "#282D86",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
