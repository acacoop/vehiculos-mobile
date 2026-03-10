import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { BottomActionButton } from "../../../components/BottomActionButton";
import Modal from "../../../components/Modal";
import { CardGrid } from "../../../components/Card";
import {
  PaginatedFlatList,
  usePaginatedList,
} from "../../../components/PaginatedFlatList";
import { getVehicle } from "../../../services/vehicles";
import { getCurrentUser } from "../../../services/me";
import {
  getKilometersLogsByVehicle,
  createKilometersLog,
} from "../../../services/vehicleKilometersLogs";
import { useToast } from "../../../hooks/useToast";
import { colors } from "../../../constants/colors";

function KilometersCard({ item }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatKilometers = (km) => {
    return `${new Intl.NumberFormat("es-AR").format(km)} km`;
  };

  const getUserName = (user) => {
    if (!user) return "Sin información";
    return `${user.firstName} ${user.lastName}`;
  };

  const items = [
    { value: formatKilometers(item.kilometers), highlight: true },
    { value: formatDate(item.date) },
    { value: getUserName(item.user), fullWidth: true },
  ];

  return <CardGrid items={items} />;
}

export default function KilometersRegister() {
  const { kilometersregister } = useLocalSearchParams();
  const licensePlate = kilometersregister;
  const toast = useToast();
  const { refreshKey, refresh } = usePaginatedList();

  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [kilometersInput, setKilometersInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch vehicle details
  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    try {
      const vehicle = await getVehicle(licensePlate);
      if (!vehicle) {
        setError("Vehículo no encontrado");
        setVehicleDetail(null);
        return;
      }
      setVehicleDetail(vehicle);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicle", err);
      setError(err.message || "No se pudo cargar el vehículo");
      setVehicleDetail(null);
    } finally {
      setLoading(false);
    }
  }, [licensePlate]);

  useFocusEffect(
    useCallback(() => {
      fetchVehicle();
    }, [fetchVehicle]),
  );

  // Fetch function for paginated list
  const fetchKilometersLogs = useCallback(
    async (page, limit) => {
      if (!vehicleDetail?.id) {
        return { items: [], total: 0, hasMore: false };
      }
      return getKilometersLogsByVehicle(vehicleDetail.id, page, limit);
    },
    [vehicleDetail?.id],
  );

  const handleOpenModal = () => {
    setKilometersInput("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setKilometersInput("");
  };

  const handleSubmit = async () => {
    const kilometers = parseInt(kilometersInput, 10);

    if (!kilometersInput || isNaN(kilometers)) {
      toast.error({
        title: "Error",
        message: "Ingrese un valor de kilometraje válido",
      });
      return;
    }

    if (kilometers <= 0) {
      toast.error({
        title: "Error",
        message: "El kilometraje debe ser mayor a 0",
      });
      return;
    }

    setSubmitting(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        toast.error({
          title: "Error",
          message: "No se pudo obtener el usuario actual",
        });
        return;
      }

      await createKilometersLog({
        vehicleId: vehicleDetail.id,
        userId: currentUser.id,
        date: new Date(),
        kilometers,
      });

      toast.success({
        title: "Éxito",
        message: "Kilometraje registrado correctamente",
      });

      handleCloseModal();
      refresh(); // Refresh the paginated list
    } catch (err) {
      console.error("Error creating kilometers log", err);

      // Parse error and show user-friendly message
      let errorMessage = "No se pudo registrar el kilometraje";

      try {
        // Try to parse if error message is JSON
        const errorData =
          typeof err?.message === "string" && err.message.includes("{")
            ? JSON.parse(err.message)
            : err?.response?.data;

        if (
          errorData?.status === 422 ||
          errorData?.type?.includes("invalid-kilometers")
        ) {
          errorMessage =
            "Ingrese un kilometraje válido. El valor debe ser mayor al último registro.";
        }
      } catch {
        // If parsing fails, use default message
      }

      toast.error({
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleListError = useCallback(
    (err) => {
      toast.error({
        title: "Error",
        message: err.message || "No se pudo cargar más registros",
      });
    },
    [toast],
  );

  return (
    <ScreenLayout
      title="Registro de kilometraje"
      loading={loading}
      error={error}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.licensePlateTitle}>
            Dominio: {vehicleDetail?.licensePlate || licensePlate}
          </Text>
          <Text style={styles.subtitle}>
            {vehicleDetail?.brand && vehicleDetail?.model
              ? `${vehicleDetail.brand} ${vehicleDetail.model}`
              : "Marca y modelo desconocidos"}
          </Text>
        </View>

        <PaginatedFlatList
          style={styles.list}
          fetchData={fetchKilometersLogs}
          renderItem={({ item }) => <KilometersCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onError={handleListError}
          enabled={!!vehicleDetail?.id}
          refreshDeps={[refreshKey, vehicleDetail?.id]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No hay registros de kilometraje para este vehículo.
            </Text>
          }
        />

        <BottomActionButton
          text="Registrar kilometraje"
          onPress={handleOpenModal}
          disabled={submitting}
        />

        <Modal
          visible={modalVisible}
          title="Registrar kilometraje"
          value={kilometersInput}
          onChangeText={setKilometersInput}
          onConfirm={handleSubmit}
          onCancel={handleCloseModal}
          confirmLabel="Guardar"
          cancelLabel="Cancelar"
          placeholder="Ingrese el kilometraje"
          keyboardType="numeric"
          multiline={false}
          confirmDisabled={submitting || !kilometersInput}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  header: {
    width: "100%",
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.shadowLight,
  },
  licensePlateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    width: "90%",
    flex: 1,
    paddingVertical: 10,
  },
  listContainer: {
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 40,
  },
});
