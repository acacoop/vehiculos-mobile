import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Vehicle } from "../interfaces/vehicle";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de tener esta importación

type CarVisualizerProps = {
  vehicles: Vehicle[];
  onVehicleChange?: (vehicle: Vehicle) => void;
};

export function CarVisualizer({
  vehicles,
  onVehicleChange,
}: CarVisualizerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (onVehicleChange && vehicles.length > 0) {
      onVehicleChange(vehicles[index]);
    }
  }, [index, vehicles]);

  if (!vehicles || vehicles.length === 0 || !vehicles[index]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay vehículos disponibles</Text>
      </View>
    );
  }

  const currentVehicle = vehicles[index];

  const goPrevious = () => {
    const newIndex = index === 0 ? vehicles.length - 1 : index - 1;
    setIndex(newIndex);
  };

  const goNext = () => {
    const newIndex = (index + 1) % vehicles.length;
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Autos Disponibles</Text> */}

      <View style={styles.vehicleInfo}>
        <Pressable onPress={goPrevious}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 30,
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.text}>{currentVehicle.licensePlate}</Text>
          </View>

          <Text style={styles.text}> | </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.text, { textAlign: "center", maxWidth: 120 }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {currentVehicle.brand + " " + currentVehicle.model}
            </Text>
          </View>
        </View>
        <Pressable onPress={goNext}>
          <Ionicons name="arrow-forward" size={28} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 350,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#282D86",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FE9000",
  },
  vehicleInfo: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  dot: {
    width: 30,
    height: 30,
    backgroundColor: "#FE9000",
    borderRadius: 3,
    borderWidth: 1,
  },
});
