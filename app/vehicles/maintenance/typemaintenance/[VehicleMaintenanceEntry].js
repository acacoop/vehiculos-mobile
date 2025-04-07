import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry } = useLocalSearchParams();

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const data = await getMaintenanceById(VehicleMaintenanceEntry);
        setMaintenance(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (VehicleMaintenanceEntry) {
      fetchMaintenance();
    }
  }, [VehicleMaintenanceEntry]);

  return (
    <View>
      <Text>Detalle del mantenimiento con ID: {VehicleMaintenanceEntry}</Text>
    </View>
  );
}
