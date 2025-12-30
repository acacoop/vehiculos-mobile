import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { getVehicle } from "../../../services/vehicles";
import { InfoVehicle } from "../../../components/InfoVehicle";
import { ScreenLayout } from "../../../components/ScreenLayout";

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

  const sections = vehicleDetail
    ? [
        {
          title: "Información general",
          items: [
            { label: "Dominio", value: vehicleDetail.licensePlate },
            { label: "Marca", value: vehicleDetail.brand },
            { label: "Modelo", value: vehicleDetail.model },
            { label: "Año", value: vehicleDetail.year },
          ],
        },
        {
          title: "Información técnica",
          items: [
            { label: "Tipo de vehículo", value: vehicleDetail.vehicleType },
            { label: "Tipo de combustible", value: vehicleDetail.fuelType },
            { label: "Transmisión", value: vehicleDetail.transmission },
            { label: "N.º de motor", value: vehicleDetail.engineNumber },
            { label: "N.º de chasis", value: vehicleDetail.chassisNumber },
          ],
        },
      ]
    : [];

  return (
    <ScreenLayout
      title="Ficha técnica vehicular"
      loading={isLoading}
      error={error || (!vehicleDetail ? "Vehículo no encontrado" : null)}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoVehicle sections={sections} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    rowGap: 32,
  },
});
