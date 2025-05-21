import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Vehicle } from "../interfaces/vehicle";
import { CustomButton } from "./CustomButton";

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
    if (onVehicleChange) {
      onVehicleChange(vehicles[index]);
    }
  }, [index]);

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
      <Text style={styles.title}>Autos Disponibles</Text>

      <View style={styles.vehicleInfo}>
        <View
          style={[
            styles.dot,
            { backgroundColor: currentVehicle.color || "#FE9000" },
          ]}
        ></View>
        <Text style={styles.text}>{currentVehicle.licensePlate}</Text>
        <Text style={styles.text}> | </Text>
        <Text style={styles.text}>{currentVehicle.model}</Text>
      </View>

      <View style={styles.buttonRow}>
        <CustomButton title="Anterior" onPress={goPrevious} />
        <CustomButton title="Siguiente" onPress={goNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 5,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  dot: {
    width: 30,
    height: 30,
    backgroundColor: "#FE9000",
    borderRadius: 3,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
