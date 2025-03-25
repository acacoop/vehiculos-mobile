import { useLocalSearchParams } from "expo-router";
import { Link } from "expo-router";
import { IconArrowLeft } from "../../components/Icons";
import { useEffect, useState } from "react";
import { getVehicle } from "../../services/vehicles";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Table } from "../../components/Table";
import { useApp } from "../../context/AppContext";

export default function VehicleDetail() {
  const { setHeaderConfig } = useApp();

  useEffect(() => {
    setHeaderConfig({
      title: "Detalle del vehículo",
      showBackButton: true,
    });

    return () =>
      setHeaderConfig({ title: "Hola @user", showBackButton: false });
  }, []);

  const { licensePlate } = useLocalSearchParams();
  const [vehicleDetail, setVehicles] = useState(null);

  useEffect(() => {
    getVehicle(licensePlate).then(setVehicles);
  }, [licensePlate]);

  return (
    <View style={style.container}>
      <View style={style.containerArrow}></View>
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
            <Table
              data={{
                Dominio: vehicleDetail.licensePlate,
                Marca: vehicleDetail.brand,
                Modelo: vehicleDetail.model,
                Año: vehicleDetail.year,
              }}
            />
          </View>
        )}
      </View>
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
    top: 0,
    left: 20,
    zIndex: 1,
  },
  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
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
