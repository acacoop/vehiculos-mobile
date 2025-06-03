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
            <Text style={styles.text1}>{vehicle.licensePlate}</Text>
            <Text style={styles.text2}>{vehicle.brand}</Text>
            <Text style={styles.text3}>{vehicle.model}</Text>
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
    borderRadius: 8,
    shadowColor: "#000",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  text2: {
    fontSize: 18,
    color: "#FE9000",
  },
  text3: {
    fontSize: 18,
    color: "#FE9000",
  },
});
