import { Vehicle } from "../interfaces/vehicle";
import { Text } from "react-native";

export function VehicleCard(vehicle: Vehicle) {
  return (
    <Text style={{ color: "#fff" }}>
      {vehicle.licensePlate} - {vehicle.brand} - {vehicle.model}
    </Text>
  );
}
