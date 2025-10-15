import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../services/vehicles";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { Table } from "../../components/Table";
import { Stack } from "expo-router";
import { IconClip, IconIdCard, IconArrowRigth } from "../../components/Icons";

export default function VehicleDetail() {
  const { licensePlate } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleDetail, setVehicles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getVehicle(licensePlate)
      .then((v) => {
        setVehicles(v);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching vehicle", err);
        setError(err.message || "No se pudo cargar el vehículo");
        setVehicles(null);
      })
      .finally(() => setLoading(false));
  }, [licensePlate]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (!vehicleDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          {error || "Vehículo no encontrado"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Vehículos disponibles",
          headerStyle: {
            backgroundColor: "#282D86",
          },
          headerTitleAlign: "center",
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{ width: "100%", flex: 1 }}
        data={[vehicleDetail]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.containerInfocar}>
            <View style={styles.infoCar}>
              <VehicleTable data={item} />
              <VehicleButtons
                vehicleId={item.id}
                licensePlate={item.licensePlate}
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          justifyContent: "center",
        }}
      >
        <Pressable
          style={styles.PressableReservar}
          onPress={() => {
            router.push(`/calendar`);
          }}
        >
          <Text style={styles.textReserva}> + Reservar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const VehicleTable = ({ data }) => (
  <Table
    data={{
      Dominio: data.licensePlate,
      Marca: data.brand,
      Modelo: data.model,
      Año: data.year,
      Tipo: data.vehicleType || "No informado",
    }}
  />
);

const VehicleButtons = ({ vehicleId, licensePlate }) => {
  const router = useRouter();

  return (
    <View style={styles.containerButton}>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push(`/vehicles/maintenance/${vehicleId}`);
        }}
      >
        <Text style={styles.buttonText}>Mantenimiento</Text>
        <IconArrowRigth size={20} />
      </Pressable>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push(`/vehicles/technical/${licensePlate}`);
        }}
      >
        <Text style={styles.buttonText}>Ficha técnica</Text>
        <IconArrowRigth size={20} />
      </Pressable>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push(`/vehicles/documentation/${licensePlate}`);
        }}
      >
        <Text style={styles.buttonText}>Documentación</Text>
        <IconArrowRigth size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  containerInfocar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingVertical: 20,
    width: "100%",
    gap: 24,
  },
  infoCar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 20,
    gap: 24,
    width: "100%",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "#282D86",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  containerButton: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "100%",
  },
  buttonText: {
    color: "#282D86",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "600",
    color: "#282D86",
  },
  PressableReservar: {
    backgroundColor: "#282D86",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: "85%",
  },
  textReserva: {
    color: "#FFFFFF",
    fontSize: 20,
    padding: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: "100%",
  },
});
