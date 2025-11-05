import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getVehicle } from "../../../services/vehicles";
import { useEffect, useMemo, useState } from "react";
import { DropDown } from "../../../components/DropDown";

export default function Checklist() {
  const { checklist } = useLocalSearchParams();
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getVehicle(checklist)
      .then((v) => {
        setVehicleDetail(v);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching vehicle", err);
        setError(err.message || "No se pudo cargar el vehículo");
        setVehicleDetail(null);
      })
      .finally(() => setLoading(false));
  }, [checklist]);

  const categories = useMemo(
    () => [
      {
        id: "motor",
        title: "Motor y Fluidos",
        iconKey: "tool",
        items: [
          { id: "aceite", label: "Nivel de aceite" },
          { id: "refrigerante", label: "Nivel de refrigerante" },
          { id: "perdidas", label: "Sin pérdidas de fluidos" },
          {
            id: "direccion-freno-mano",
            label: "Dirección y freno de mano operativos",
          },
        ],
      },
      {
        id: "luces",
        title: "Luces y Señalización",
        iconKey: "bulb1",
        items: [
          { id: "posicion", label: "Luces de posición" },
          { id: "freno", label: "Luces de freno" },
          { id: "giro", label: "Luces de giro / balizas" },
          { id: "retroceso", label: "Luces de retroceso" },
          { id: "bocina", label: "Bocina" },
        ],
      },
      {
        id: "neumaticos",
        title: "Neumáticos y Carrocería",
        iconKey: "car",
        items: [
          { id: "cubiertas", label: "Estado de cubiertas" },
          { id: "espejos", label: "Estado de espejos" },
          { id: "parabrisas", label: "Estado del parabrisas" },
          { id: "combustible", label: "Tapa de combustible" },
          { id: "auxilio", label: "Rueda de auxilio + accesorios" },
        ],
      },
      {
        id: "seguridad",
        title: "Seguridad y Emergencia",
        iconKey: "Safety",
        items: [
          { id: "cinturones", label: "Cinturones de seguridad" },
          { id: "apoyacabezas", label: "Apoyacabezas" },
          { id: "matafuego", label: "Matafuego vigente" },
          { id: "chaleco", label: "Chaleco reflectivo" },
          { id: "balizas", label: "Balizas y botiquín" },
        ],
      },
    ],
    [],
  );

  const initialResponses = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.items.reduce((itemAcc, item) => {
        itemAcc[item.id] = null;
        return itemAcc;
      }, {});
      return acc;
    }, {});
  }, [categories]);

  const [responses, setResponses] = useState(initialResponses);

  useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  const handleResponsesChange = (next) => {
    setResponses(next);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Checklist Vehicular",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.licensePlateTitle}>
            Dominio: {vehicleDetail?.licensePlate || checklist}
          </Text>
          <Text style={styles.subtitle}>
            {vehicleDetail?.brand && vehicleDetail?.model
              ? `${vehicleDetail.brand} ${vehicleDetail.model}`
              : "Marca y modelo desconocidos"}
          </Text>
        </View>
        <View style={{ width: "90%", alignItems: "center", paddingBottom: 20 }}>
          <DropDown
            categories={categories}
            value={responses}
            onChange={handleResponsesChange}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  header: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  licensePlateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#282D86",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A80A6",
  },
  scrollContent: {
    flex: 1,
    width: "100%",
    gap: 24,
    paddingBottom: 60,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
