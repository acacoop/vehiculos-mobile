import { useLocalSearchParams } from "expo-router";
import { Link } from "expo-router";
import { IconArrowLeft } from "../../components/Icons";
import { useEffect, useState } from "react";
import { getVehicle } from "../../services/vehicles";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

export default function VehicleDetail() {
  const { licensePlate } = useLocalSearchParams();
  const [vehicleDetail, setVehicles] = useState(null);

  useEffect(() => {
    getVehicle(licensePlate).then(setVehicles);
  }, [licensePlate]);

  return (
    <View style={style.container}>
      <Header />
      <View style={style.containerArrow}>
        <Link asChild href="/vehicles">
          <Pressable style={style.button}>
            {({ pressed }) => (
              <IconArrowLeft
                pressed={pressed}
                style={{ color: pressed ? "#FE9000" : "#282D86" }}
              />
            )}
          </Pressable>
        </Link>
      </View>
      <View style={style.containerInfocar}>
        {vehicleDetail === null ? (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color="#282D86" />
          </View>
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
  containerArrow: {
    position: "absolute",
    top: 140,
    left: 20,
    zIndex: 1,
  },
  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 60,
    padding: 2,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffff",
  },
});
