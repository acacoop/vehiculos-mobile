import { Link } from "expo-router";
import { Vehicle } from "../interfaces/vehicle";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";

type VisualizerProps = { vehicle: Vehicle };
export function CarVisualizer({ vehicle }: VisualizerProps) {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.text1}>{vehicle.licensePlate}</Text>
      <Text style={styles.text2}>{vehicle.brand}</Text>
      <Text style={styles.text3}>{vehicle.model}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  text2: {
    fontSize: 15,
    color: "#FE9000",
  },
  text3: {
    fontSize: 15,
    color: "#FE9000",
  },
});
