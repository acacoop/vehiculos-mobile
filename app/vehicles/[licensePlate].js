import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../services/vehicles";
import { View, StyleSheet, Pressable, FlatList, Text } from "react-native";
import { Table } from "../../components/Table";
import { Icon } from "../../components/Icons";
import { ScreenLayout } from "../../components/ScreenLayout";
import { colors } from "../../constants/colors";

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

  return (
    <ScreenLayout
      title="Vehículos disponibles"
      loading={loading}
      error={!vehicleDetail ? error || "Vehículo no encontrado" : null}
    >
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
                modelId={item.modelId}
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.containerReservar}>
        <Pressable
          style={styles.PressableReservar}
          onPress={() => {
            router.push({
              pathname: `/calendar`,
              params: {
                vehicleId: vehicleDetail.id,
                licensePlate: vehicleDetail.licensePlate,
              },
            });
          }}
        >
          <Text style={styles.textReserva}>Reservar</Text>
        </Pressable>
      </View>
    </ScreenLayout>
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

const VehicleButtons = ({ vehicleId, licensePlate, modelId }) => {
  const router = useRouter();

  return (
    <View style={styles.containerButton}>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push({
            pathname: `/vehicles/maintenance/${vehicleId}`,
            params: { modelId },
          });
        }}
      >
        <Text style={styles.buttonText}>Mantenimiento</Text>
        <Icon name="right" size={20} />
      </Pressable>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push(`/vehicles/technical/${licensePlate}`);
        }}
      >
        <Text style={styles.buttonText}>Ficha técnica</Text>
        <Icon name="right" size={20} />
      </Pressable>
      {/* <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push(`/vehicles/documentation/${licensePlate}`);
        }}
      >
        <Text style={styles.buttonText}>Documentación</Text>
        <Icon name="right" size={20} />
      </Pressable> */}
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          router.push({
            pathname: "/vehicles/quarterly-control/history",
            params: { licensePlate },
          });
        }}
      >
        <Text style={styles.buttonText}>Control trimestral</Text>
        <Icon name="right" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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

    gap: 24,
    width: "100%",
  },
  containerButton: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 20,
  },
  containerReservar: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    zIndex: 10,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.gray[500],
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
    color: colors.primary,
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  PressableReservar: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  textReserva: {
    color: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
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
