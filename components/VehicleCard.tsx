import { Link } from "expo-router";
import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { IconCar } from "./Icons";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.licensePlate}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <View style={styles.containerImage}>
            <IconCar size={40} />
          </View>
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
    width: "90%",
    height: 120,
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
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#f1f1f1ff",
    borderRadius: "100%",
    padding: 5,
  },
});
