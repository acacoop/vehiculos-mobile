import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
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
      (vehicle) => String(vehicle.id) === String(initialVehicleId),
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
      <View style={[styles.container, { width: containerWidth as any }]}>
        <View style={styles.emptyState}>
          <Icon name="car" size={32} color="#9CA3AF" />
          <Text style={styles.emptyText}>No hay vehículos disponibles</Text>
        </View>
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
      <Pressable
        onPress={goPrevious}
        style={({ pressed }) => [
          styles.arrowButton,
          styles.arrowLeft,
          pressed && styles.arrowButtonPressed,
        ]}
      >
        <Icon name="left" size={18} color="#282D86" />
      </Pressable>
      <View style={styles.vehicleCard}>
        <View style={styles.content}>
          <View style={styles.plateContainer}>
            <Text style={styles.plateText}>{currentVehicle.licensePlate}</Text>
          </View>
          <Text style={styles.brandText} numberOfLines={1} ellipsizeMode="tail">
            {currentVehicle.brand} {currentVehicle.model}
          </Text>
          <View style={styles.pagination}>
            {vehicles.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>
      <Pressable
        onPress={goNext}
        style={({ pressed }) => [
          styles.arrowButton,
          styles.arrowRight,
          pressed && styles.arrowButtonPressed,
        ]}
      >
        <Icon name="right" size={18} color="#282D86" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    marginTop: -18,
    zIndex: 1,
  },
  arrowLeft: {
    left: 12,
  },
  arrowRight: {
    right: 12,
  },
  arrowButtonPressed: {
    opacity: 0.5,
  },
  vehicleCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 56,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  plateContainer: {
    backgroundColor: "#282D86",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  plateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 2,
  },
  brandText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  pagination: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    backgroundColor: "#282D86",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
