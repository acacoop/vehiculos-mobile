import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";

const InfoCar = () => {
  return (
    <View style={style.container}>
      <Header />
      <View style={style.containerVehicle}>
        <Text>Información del vehículo</Text>
      </View>
      <View style={style.cardVehicle}>
        <View style={style.infoVehicle}>
          <Text>Marca: </Text>
          <Text>Modelo: </Text>
          <Text>Placa: </Text>
          <Text>Color: </Text>
          <Text>Fecha de compra: </Text>
          <Text>Estado: </Text>
        </View>
      </View>
      <Navbar />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
  },
  cardVehicle: {
    flex: 1,
    paddingBottom: 100,
    width: 300,
  },
  containerVehicle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    padding: 30,
  },
  infoVehicle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
  },
});

export default InfoCar;
