import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet } from "react-native";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <View>
      <Image source={{ uri: vehicle.imgUrl }} style={styles.image} />
      <Text style={{ color: "#fff" }}>{vehicle.licensePlate}</Text>
      <Text style={{ color: "#fff" }}>{vehicle.brand}</Text>
      <Text style={{ color: "#fff" }}>{vehicle.model}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
