import { Link } from "expo-router";
import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.licensePlate}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <Image source={{ uri: vehicle.imgUrl }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text1}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={styles.text2}>{vehicle.licensePlate}</Text>
            <Text style={styles.text2}>{vehicle.fuelType}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    width: 350,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#0000009d",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#282D86",
    marginBottom: 5,
  },
  text2: {
    fontSize: 16,
    color: "#FE9000",
  },
});
