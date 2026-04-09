import { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Button } from "../../components/Buttons";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { getMyVehicles } from "../../services/vehicles";
import { ReserveModal } from "../../components/ReserveModal";
import {
  createReservation,
  getReservationsByVehicle,
} from "../../services/reservations";
import { getCurrentUser } from "../../services/me";
import { colors } from "../../constants/colors";
import {
  PaginatedFlatList,
  usePaginatedList,
} from "../../components/PaginatedFlatList";

const Calendar = () => {
  const params = useLocalSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();
  const { refreshKey, refresh } = usePaginatedList();
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [initialVehicleId, setInitialVehicleId] = useState(null);
  const [initialSelectionApplied, setInitialSelectionApplied] = useState(false);

  const navigateToReservations = ({ start, end } = {}) => {
    const params = {};
    if (selectedVehicle) params.vehicleId = selectedVehicle.id;
    if (start) params.start = start;
    if (end) params.end = end;
    router.push({
      pathname: "/reservations",
      params,
    });
  };

  const fetchCalendarData = useCallback(async () => {
    const vehiclesData = await getMyVehicles();
    setVehicles(vehiclesData);

    const user = await getCurrentUser().catch((error) => {
      console.error("No se pudo obtener el usuario actual", error);
      return null;
    });
    setCurrentUser(user);

    if (selectedVehicle?.id) {
      try {
        const reservationsData = await getReservationsByVehicle(
          selectedVehicle.id,
        );
        setReservations(reservationsData);
        setReservationsError(null);
      } catch (error) {
        console.error("Error al obtener las reservas", error);
        setReservations([]);
        setReservationsError(
          error?.message || "No se pudieron cargar las reservas",
        );
      }
    } else {
      setReservations([]);
      setReservationsError(null);
    }

    return {
      items: [],
      total: 0,
      hasMore: false,
    };
  }, [selectedVehicle?.id]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const coerceParam = (value) => {
    if (Array.isArray(value)) return value[0];
    return value ?? null;
  };

  useEffect(() => {
    setInitialSelectionApplied(false);
  }, [params.vehicleId, params.licensePlate]);

  useEffect(() => {
    if (!vehicles.length || initialSelectionApplied) return;

    const desiredId = coerceParam(params.vehicleId);
    const desiredPlate = coerceParam(params.licensePlate);

    if (!desiredId && !desiredPlate) {
      setInitialVehicleId((prev) => (prev === null ? prev : null));
      setInitialSelectionApplied(true);
      return;
    }

    const found = vehicles.find(
      (vehicle) =>
        (desiredId && vehicle.id === desiredId) ||
        (desiredPlate && vehicle.licensePlate === desiredPlate),
    );

    if (found) {
      setSelectedVehicle(found);
      setInitialVehicleId((prev) => (prev === found.id ? prev : found.id));
    }

    setInitialSelectionApplied(true);
  }, [
    vehicles,
    params.vehicleId,
    params.licensePlate,
    initialSelectionApplied,
  ]);

  const handleModalConfirm = async () => {
    if (!selectedVehicle?.id) {
      Alert.alert(
        "Selecciona un vehículo",
        "Debes elegir un vehículo antes de crear la reserva.",
      );
      return;
    }

    if (!currentUser?.id) {
      Alert.alert(
        "Sesión no disponible",
        "No se pudo identificar al usuario actual. Inicia sesión nuevamente.",
      );
      return;
    }

    try {
      setIsSubmittingReservation(true);
      const created = await createReservation({
        vehicleId: selectedVehicle.id,
        userId: currentUser.id,
        startDate: fromDate,
        endDate: toDate,
      });
      setReservations((prev) => [created, ...prev]);
      setShowReserveModal(false);
    } catch (error) {
      console.error("No se pudo crear la reserva", error);
      Alert.alert(
        "Error",
        error?.message || "No se pudo crear la reserva. Intenta nuevamente.",
      );
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  const calendarReservations = useMemo(
    () =>
      reservations.map((reservation) => ({
        id: reservation.id,
        from: reservation.startDate,
        to: reservation.endDate,
        vehicleId: reservation.vehicleId,
        licensePlate: reservation.licensePlate,
      })),
    [reservations],
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Calendario",
        }}
      />

      <PaginatedFlatList
        style={{ width: "100%", flex: 1 }}
        fetchData={fetchCalendarData}
        renderItem={() => null}
        refreshDeps={[
          refreshKey,
          selectedVehicle?.id,
          params.vehicleId,
          params.licensePlate,
        ]}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <CarVisualizer
              vehicles={vehicles}
              initialVehicleId={initialVehicleId}
              onVehicleChange={(vehicle) => {
                setSelectedVehicle(vehicle);
              }}
            />

            {selectedVehicle && (
              <Calendario
                key={selectedVehicle.id}
                reservations={calendarReservations}
                selectedVehicle={selectedVehicle}
                onDayPress={(date) => {
                  const day = new Date(date);
                  day.setHours(0, 0, 0, 0);
                  const start = day.toISOString();
                  const endDate = new Date(day);
                  endDate.setHours(23, 59, 59, 999);
                  const end = endDate.toISOString();
                  navigateToReservations({ start, end });
                }}
              />
            )}

            {reservationsError && (
              <Text style={{ color: colors.errorDark, marginTop: 8 }}>
                {reservationsError}
              </Text>
            )}

            <View style={styles.buttonGroup}>
              <Button
                text="Ver reservas"
                variant="tertiary"
                onPress={() => {
                  navigateToReservations();
                }}
              />

              <Button
                text="Reservar vehículo"
                variant="primary"
                onPress={() => setShowReserveModal(true)}
              />
            </View>
          </>
        }
      />

      <ReserveModal
        visible={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        onConfirm={handleModalConfirm}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        confirmLoading={isSubmittingReservation}
        confirmDisabled={!selectedVehicle}
      />
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  buttonGroup: {
    display: "flex",
    width: "100%",
    gap: 20,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
  },

  arrowRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 20,
  },
  arrowButton: {
    padding: 10,
  },
});
