import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  useLocalSearchParams,
  Stack,
  useNavigation,
  useRouter,
} from "expo-router";
import { getMaintenanceRecordsPaginated } from "../../../../services/maintenanceRecords";
import { Table } from "../../../../components/Table";
import { BottomActionButton } from "../../../../components/BottomActionButton";
import { CardGrid } from "../../../../components/Card";
import {
  PaginatedFlatList,
  usePaginatedList,
} from "../../../../components/PaginatedFlatList";
import { useToast } from "../../../../hooks/useToast";
import { colors } from "../../../../constants/colors";

function MaintenanceHistoryCard({ item }) {
  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    try {
      const d = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return "Sin fecha";
    }
  };

  const formatKilometers = (km) => {
    if (km === undefined || km === null) return "-";
    return `${new Intl.NumberFormat("es-AR").format(km)} km`;
  };

  const items = [
    { value: formatDate(item.date), highlight: true },
    { value: formatKilometers(item.kilometers) },
  ];

  // Add notes if present as full width item
  if (item.notes) {
    items.push({ value: `Observación: ${item.notes}`, fullWidth: true });
  }

  return <CardGrid items={items} />;
}

export default function VehicleMaintenanceEntry() {
  const { VehicleMaintenanceEntry, vehicleId } = useLocalSearchParams();
  const maintenance = JSON.parse(VehicleMaintenanceEntry);

  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const { refreshKey } = usePaginatedList();

  const maintenanceId = maintenance?.maintenanceId;

  const fetchMaintenanceRecords = useCallback(
    async (page, limit) => {
      if (!maintenanceId || !vehicleId) {
        return { items: [], total: 0, hasMore: false };
      }
      return getMaintenanceRecordsPaginated(
        { maintenanceId, vehicleId },
        page,
        limit,
      );
    },
    [maintenanceId, vehicleId],
  );

  const handleError = useCallback(
    (error) => {
      toast.error({
        title: "Error",
        message: error.message || "No se pudo cargar más registros",
      });
    },
    [toast],
  );

  useEffect(() => {
    if (maintenance?.maintenanceName) {
      navigation.setOptions({
        title: maintenance.maintenanceName,
      });
    }
  }, [maintenance, navigation]);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Table
        data={{
          Mantenimiento: maintenance.maintenanceCategoryName,
          "Frecuencia (km)":
            maintenance.kilometersFrequency ||
            maintenance.kilometersFrequency === 0
              ? `${maintenance.kilometersFrequency} km`
              : "-",
          "Frecuencia (días)":
            maintenance.daysFrequency || maintenance.daysFrequency === 0
              ? `${maintenance.daysFrequency} días`
              : "-",
        }}
      />
      <Text style={styles.historyTitle}>Historial de mantenimientos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: maintenance.maintenanceName,
          headerTitleAlign: "center",
        }}
      />

      <PaginatedFlatList
        style={styles.list}
        fetchData={fetchMaintenanceRecords}
        renderItem={({ item }) => <MaintenanceHistoryCard item={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyHistoryText}>
            No hay registros de mantenimiento disponibles
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onError={handleError}
        enabled={!!maintenanceId && !!vehicleId}
        refreshDeps={[refreshKey, maintenanceId, vehicleId]}
      />

      <BottomActionButton
        text={
          !maintenanceId || !vehicleId
            ? "Mantenimiento no disponible"
            : "Registrar mantenimiento"
        }
        onPress={() =>
          router.push({
            pathname: "/vehicles/maintenance/typemaintenance/add-maintenance",
            params: {
              maintenanceId,
              vehicleId,
              maintenanceName: maintenance?.maintenanceName ?? "",
              maintenanceCategoryName:
                maintenance?.maintenanceCategoryName ?? "",
              kilometersFrequency: String(
                maintenance?.kilometersFrequency ?? "",
              ),
              daysFrequency: String(maintenance?.daysFrequency ?? ""),
            },
          })
        }
        disabled={!maintenanceId || !vehicleId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },
  headerContent: {
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
});
