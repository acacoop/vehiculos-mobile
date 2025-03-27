import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function Maintenance() {
  const { licensePlate } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Mantenimiento del vehículo" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 20,
  },
  text: { fontSize: 18, color: "#333" },
});
