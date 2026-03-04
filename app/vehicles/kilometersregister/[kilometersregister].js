import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { BottomActionButton } from "../../../components/BottomActionButton";
import Modal from "../../../components/Modal";
import { CardGrid } from "../../../components/Card";
import { getVehicle } from "../../../services/vehicles";
import { getCurrentUser } from "../../../services/me";
import {
  getKilometersLogsByVehicle,
  createKilometersLog,
} from "../../../services/vehicleKilometersLogs";
import { useToast } from "../../../hooks/useToast";
import { colors } from "../../../constants/colors";

const PAGE_SIZE = 10;

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

  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [kilometersInput, setKilometersInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const vehicle = await getVehicle(licensePlate);
      if (!vehicle) {
        setError("Vehículo no encontrado");
        setVehicleDetail(null);
        setLogs([]);
        return;
      }

      setVehicleDetail(vehicle);

      const result = await getKilometersLogsByVehicle(vehicle.id, 1, PAGE_SIZE);
      setLogs(result.items);
      setHasMore(result.hasMore);
      setPage(1);
      setError(null);
    } catch (err) {
      console.error("Error fetching data", err);
      setError(err.message || "No se pudo cargar el historial");
      setVehicleDetail(null);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [licensePlate]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
    }, [fetchInitialData])
  );

  const loadMore = async () => {
    if (loadingMore || !hasMore || !vehicleDetail) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getKilometersLogsByVehicle(
        vehicleDetail.id,
        nextPage,
        PAGE_SIZE
      );
      setLogs((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more", err);
      toast.error({
        title: "Error",
        message: "No se pudo cargar más registros",
      });
    } finally {
      setLoadingMore(false);
    }
  };

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
      await fetchInitialData();
    } catch (err) {
      console.error("Error creating kilometers log", err);
      
      // Parse error and show user-friendly message
      let errorMessage = "No se pudo registrar el kilometraje";
      
      try {
        // Try to parse if error message is JSON
        const errorData = typeof err?.message === "string" && err.message.includes("{")
          ? JSON.parse(err.message)
          : err?.response?.data;
        
        if (errorData?.status === 422 || errorData?.type?.includes("invalid-kilometers")) {
          errorMessage = "Ingrese un kilometraje válido. El valor debe ser mayor al último registro.";
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

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

        <FlatList
          style={styles.list}
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <KilometersCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 16,
    marginBottom: 16,
  },
  licensePlateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    width: "90%",
    flex: 1,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
