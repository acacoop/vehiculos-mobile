import { Link } from "expo-router";
import { Vehicle } from "../interfaces/vehicle";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Icon } from "./Icons";

type VehicleCardProps = { vehicle: Vehicle };
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.licensePlate}`} asChild>
      <Pressable style={styles.touchable}>
        <View style={styles.card}>
          <View style={styles.containerImage}>
            <Icon name="car" size={40} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text1}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={styles.text2}>{vehicle.licensePlate}</Text>
            <Text style={styles.text3}>{vehicle.fuelType}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    alignItems: "stretch",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
    width: "90%",
    alignSelf: "center",
    height: 120,
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 5,
  },
  text2: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8b8b8bff",
  },
  text3: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fe9000",
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f1f1f1ff",
    borderRadius: "100%",
    marginLeft: 20,
  },
});
