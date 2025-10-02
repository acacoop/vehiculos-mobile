import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { getAllVehicles } from "../../../services/vehicles";
import { VehicleCard } from "../../../components/VehicleCard";
import { Stack } from "expo-router";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllVehicles()
      .then((data) => {
        setVehicles(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vehicles", err);
        setError(err.message || "No se pudo cargar la lista de vehículos");
        setVehicles([]);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Vehículos",
        }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#282D86" />
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : vehicles.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>
            No hay vehículos disponibles para mostrar
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ width: "100%", flex: 1 }}
          data={vehicles}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            alignItems: "center",
            padding: 20,
            gap: 20,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  emptyText: {
    color: "#282D86",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
