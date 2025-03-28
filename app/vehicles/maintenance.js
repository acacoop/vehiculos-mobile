import { ScrollView, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { MaintenanceCard } from "../../components/MaintenanceCard";

export default function Maintenance() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Mantenimiento del vehículo" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MaintenanceCard />
        <MaintenanceCard />
        <MaintenanceCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    alignItems: "center",
    gap: 30,
  },
});
