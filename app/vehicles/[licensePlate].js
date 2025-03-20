import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getVehicle } from "../../lib/vehicles";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

export default function VehicleDetail() {
  const { licensePlate } = useLocalSearchParams();
  const [vehicleDetail, setVehicles] = useState(null);

  useEffect(() => {
    getVehicle(licensePlate).then(setVehicles);
  }, []);

  return (
    <View style={style.container}>
      <Header />
      <View style={style.containerInfocar}>
        {vehicleDetail === null ? (
          <Text>Loading...</Text>
        ) : (
          <View style={style.infoCar}>
            <Text>License Plate: {vehicleDetail.licensePlate}</Text>
            <Text>Brand: {vehicleDetail.brand}</Text>
            <Text>Model: {vehicleDetail.model}</Text>
            <Text>Year: {vehicleDetail.year}</Text>
          </View>
        )}
      </View>
      <Navbar />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    paddingBottom: 100,
  },
  cardVehicle: {
    flex: 1,
    width: 300,
  },
  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    width: 300,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    padding: 30,
  },
  infoCar: {
    flex: 1,
    flexDirection: "column",
    color: "#000",
  },
});
