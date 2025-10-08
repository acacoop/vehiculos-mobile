import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { getVehicle } from "../../../services/vehicles";
import { Table } from "../../../components/Table";

export default function TechnicalSheet() {
  const params = useLocalSearchParams();
  const licensePlate = useMemo(() => {
    const param = params?.technicalSheet ?? params?.technicalsheet;
    if (Array.isArray(param)) {
      return param[0] ?? null;
    }
    return param ?? null;
  }, [params]);

  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadVehicle = async () => {
      if (!licensePlate || typeof licensePlate !== "string") {
        setError("No se especificó un dominio válido.");
        setVehicleDetail(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const vehicle = await getVehicle(licensePlate);
        if (!isMounted) return;

        if (!vehicle) {
          setError("No encontramos datos para este vehículo.");
          setVehicleDetail(null);
          return;
        }

        setVehicleDetail(vehicle);
      } catch (err) {
        if (!isMounted) return;
        console.error("No se pudo cargar la ficha técnica", err);
        setError("No se pudo cargar la ficha técnica. Intenta nuevamente.");
        setVehicleDetail(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadVehicle();

    return () => {
      isMounted = false;
    };
  }, [licensePlate]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerTitle: "Ficha técnica vehicular" }} />
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerTitle: "Ficha técnica vehicular" }} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!vehicleDetail) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Ficha técnica vehicular" }} />
      <FlatList
        data={[vehicleDetail]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.infoCar}>
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

const VehicleImage = ({ uri, licensePlate }) => (
  <View style={styles.containerImage}>
    {uri ? (
      <Image source={{ uri }} style={styles.image} />
    ) : (
      <View style={styles.fallbackImage}>
        <Text style={styles.fallbackText}>{licensePlate}</Text>
      </View>
    )}
  </View>
);

const VehicleTable = ({ data }) => (
  <Table
    data={{
      Dominio: data.licensePlate,
      Año: data.year,
      Marca: data.brand || "No informado",
      Modelo: data.model || "No informado",
      Tipo: data.vehicleType || "No informado",
      Transmisión: data.transmission || "No informado",
      "Tipo de combustible": data.fuelType || "No informado",
      "N.º de motor": data.engineNumber || "No informado",
      "N.º de chasis": data.chassisNumber || "No informado",
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
    paddingHorizontal: 24,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  infoCar: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
  containerImage: {
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  fallbackImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#607D8B",
  },
});
