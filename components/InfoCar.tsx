import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Vehicle } from "../interfaces/vehicle";

const InfoCar = () => {
  return (
    <View>
      <View style={style.cardVehicle}></View>
      <Text>InfoCar</Text>
    </View>
  );
};

const style = StyleSheet.create({
  cardVehicle: {},
});

export default InfoCar;
