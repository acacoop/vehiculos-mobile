import { VehicleCard } from "../components/VehicleCard";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getAllVehicles } from "../lib/vehicles";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data));
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
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
    fontSize: 22,
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
});
