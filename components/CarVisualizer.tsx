import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Vehicle } from "../interfaces/vehicle";
import { Icon } from "./Icons";

type CarVisualizerProps = {
  vehicles: Vehicle[];
  onVehicleChange?: (vehicle: Vehicle) => void;
  initialVehicleId?: string | null;
  containerWidth?: string | number;
};

export function CarVisualizer({
  vehicles,
  onVehicleChange,
  initialVehicleId,
  containerWidth = "90%",
}: CarVisualizerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (initialVehicleId == null) return;
    const targetIndex = vehicles.findIndex(
      (vehicle) => String(vehicle.id) === String(initialVehicleId)
    );
    if (targetIndex >= 0) {
      setIndex((current) => (current === targetIndex ? current : targetIndex));
    }
  }, [initialVehicleId, vehicles]);

  useEffect(() => {
    if (onVehicleChange && vehicles.length > 0 && vehicles[index]) {
      onVehicleChange(vehicles[index]);
    }
  }, [index, vehicles, onVehicleChange]);

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
    <View style={[styles.container, { width: containerWidth as any }]}>
      <View style={styles.vehicleInfo}>
        <Icon name="left" onPress={goPrevious} size={20} color="#282D86" />

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
        <Icon name="right" onPress={goNext} size={20} color="#282D86" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: "90%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#ffff",
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#282D86",
    textAlign: "center",
  },
  vehicleInfo: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#282D86",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#282D86",
    borderRadius: 3,
    borderWidth: 1,
  },
});
