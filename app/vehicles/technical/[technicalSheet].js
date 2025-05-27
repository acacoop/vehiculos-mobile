import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../../services/vehicles";
import { Table } from "../../../components/Table";

export default function TechnicalSheet() {
  const { technicalsheet } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleDetail, setVehicles] = useState(null);

  useEffect(() => {
    getVehicle(technicalsheet).then(setVehicles);
  }, [technicalsheet]);
  if (vehicleDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Ficha técnica vehicular" }} />
      <FlatList
        data={[vehicleDetail]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.infoCar}>
            <VehicleImage uri={item.imgUrl} />
            <VehicleTable data={item} />
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
      ></FlatList>
    </View>
  );
}

const VehicleImage = ({ uri }) => (
  <View style={styles.containerImage}>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

const VehicleTable = ({ data }) => (
  <Table
    data={{
      Dominio: data.licensePlate,
      Marca: data.brand,
      Modelo: data.model,
      Año: data.year,
      NumMotor: data.engineNumber,
      NumChasis: data.chassisNumber,
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
  },
});
