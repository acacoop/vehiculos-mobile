import { Vehicle } from "../interfaces/vehicle";
import { Text, View, StyleSheet } from "react-native";

type VisualizerProps = { vehicle: Vehicle };
export function CarVisualizer({ vehicle }: VisualizerProps) {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.text1}>Autos Disponibles</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            width: 20,
            backgroundColor: "#FE9000",
            borderRadius: 3,
            borderWidth: 1,
          }}
        ></View>
        <Text style={styles.text3}>{vehicle.licensePlate}</Text>
        <Text style={styles.text3}> | </Text>
        <Text style={styles.text3}>{vehicle.model}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: "column",
    color: "#000",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 5,
  },
  text3: {
    fontSize: 15,
    fontWeight: "bold",
    color: "000",
  },
});
