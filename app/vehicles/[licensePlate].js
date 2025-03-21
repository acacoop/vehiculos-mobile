import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getVehicle } from "../../lib/vehicles";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
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
            <View style={style.containerImage}>
              <Image
                source={{ uri: vehicleDetail.imgUrl }}
                style={style.image}
              />
            </View>
            <FlatList
              style={style.cardVehicle}
              data={[
                { key: "Dominio", value: vehicleDetail.licensePlate },
                { key: "Fabricante", value: vehicleDetail.brand },
                { key: "Modelo", value: vehicleDetail.model },
                { key: "Año", value: vehicleDetail.year },
              ]}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <Text style={style.Text}>
                  {item.key}: {item.value}
                </Text>
              )}
            />
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

  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    width: 350,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 40,
    padding: 30,
  },
  infoCar: {
    flexDirection: "column",
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  containerImage: {
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 8,
    padding: 5,
  },
  cardVehicle: {
    flexDirection: "column",
    width: 250,
    margin: 20,
    gap: 10,
  },
  Text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: 400,
  },
});
