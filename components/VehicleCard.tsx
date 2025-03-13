import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet } from "react-native";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: vehicle.imgUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{vehicle.licensePlate}</Text>
        <Text style={styles.text2}>{vehicle.brand}</Text>
        <Text style={styles.text3}>{vehicle.model}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    width: 300,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    color: "#000",
  },
  text1: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 5,
  },
  text2: {
    fontSize: 20,
    color: "#FE9000",
  },
  text3: {
    fontSize: 20,
    color: "#FE9000",
  },
});
