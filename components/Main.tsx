import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Vehicle } from "../interfaces/vehicle";
import { getAllVehicles } from "../lib/vehicles";
import { VehicleCard } from "./VehicleCard";

export function Main() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data));
  }, []);

  return (
    <View>
      <Text style={{ color: "#fff", fontSize: 50 }}> Vehicles</Text>
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))}
    </View>
  );
}
