import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Vehicle } from "../interfaces/vehicle";
import { getAllVehicles } from "../lib/vehicles";
import { VehicleCard } from "./VehicleCard";
import Navbar from "./Navbar";
import Header from "./Header";

export function Main() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true); // Estado para el loading

  useEffect(() => {
    getAllVehicles()
      .then((data) => {
        setVehicles(data);
        setLoading(false); // Al terminar de cargar los datos, desactivar el loading
      })
      .catch(() => setLoading(false)); // En caso de error, también desactivar el loading
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#282D86" />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }}
        />
      )}

      <View style={styles.Navbar}>
        <Navbar />
      </View>
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
  headerContainer: {
    width: "100%",
  },
  titulo: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    paddingTop: 20,
  },
  Navbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
