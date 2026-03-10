import { View, StyleSheet, Text } from "react-native";
import { useCallback } from "react";
import { getMyVehicles } from "../../../services/vehicles";
import { VehicleCard } from "../../../components/VehicleCard";
import { PaginatedFlatList } from "../../../components/PaginatedFlatList";
import { Stack } from "expo-router";
import { colors } from "../../../constants/colors";

export default function Vehicles() {
  const fetchVehicles = useCallback(async () => {
    const data = await getMyVehicles();
    return {
      items: data,
      total: data.length,
      hasMore: false,
    };
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Vehículos",
        }}
      />
      <PaginatedFlatList
        style={{ width: "100%", flex: 1 }}
        fetchData={fetchVehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay vehículos disponibles para mostrar
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
    marginTop: 40,
  },
  listContent: {
    paddingVertical: 20,
    gap: 25,
    alignItems: "stretch",
  },
});
