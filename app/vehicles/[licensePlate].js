import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../services/vehicles";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { Table } from "../../components/Table";
import { Stack } from "expo-router";
import { IconTool, IconClip, IconIdCard } from "../../components/Icons";

export default function VehicleDetail() {
  const { licensePlate } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleDetail, setVehicles] = useState(null);

  useEffect(() => {
    getVehicle(licensePlate).then(setVehicles);
  }, [licensePlate]);

  if (vehicleDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        data={[vehicleDetail]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.containerInfocar}>
            <Stack.Screen options={{ headerTitle: "Vehículos disponibles" }} />
            <View style={styles.infoCar}>
              <VehicleImage uri={item.imgUrl} />

              <VehicleTable data={item} />

              <VehicleButtons vehicleId={item.id} />
            </View>
            <Pressable
              style={styles.PressableReservar}
              onPress={() => {
                router.push(`/calendar`);
              }}
            >
              <Text style={styles.textReserva}>Reservar</Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
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
    }}
  />
);

const VehicleButtons = ({ vehicleId, technicalSheet, documentation }) => {
  const router = useRouter();

  return (
    <View style={styles.containerButton}>
      <Pressable
        style={styles.Pressable}
        onPress={() => {
          router.push(`/vehicles/maintenance/${vehicleId}`);
        }}
      >
        <Text style={styles.buttonText}>Mantenimiento</Text>
        <IconTool />
      </Pressable>
      <Pressable
        style={styles.Pressable}
        onPress={() => {
          router.push(`/vehicles/technical/${technicalSheet}`);
        }}
      >
        <Text style={styles.buttonText}>Ficha técnica</Text>
        <IconClip />
      </Pressable>
      <Pressable
        style={styles.Pressable}
        onPress={() => {
          router.push(`/vehicles/documentation/${documentation}`);
        }}
      >
        <Text style={styles.buttonText}>Documentación</Text>
        <IconIdCard />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    padding: 2,
    width: "100%",
  },
  infoCar: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  image: { width: 300, height: 150, borderRadius: 8 },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  containerButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 8,
    width: "100%",
    gap: 10,
  },
  Pressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    width: 300,
  },
  buttonText: {
    color: "#282D86",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#282D86",
  },
  PressableReservar: {
    backgroundColor: "#282D86",
    borderRadius: 8,
    margin: 30,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textReserva: {
    color: "#FFFFFF",
    fontSize: 20,
    padding: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
