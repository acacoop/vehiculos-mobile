import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";
import { Stack, useRouter } from "expo-router";
import { getAllVehicles } from "../../services/vehicles";
import { ReserveModal } from "../../components/ReserveModal";
import {
  createReservation,
  getReservationsByVehicle,
} from "../../services/reservations";
import { getCurrentUser } from "../../services/me";

const Calendar = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

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

  useEffect(() => {
    getAllVehicles()
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((error) => {
        console.error("No se pudo obtener el usuario actual", error);
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    if (!selectedVehicle?.id) {
      setReservations([]);
      return;
    }

    let isMounted = true;
    setReservationsLoading(true);
    setReservationsError(null);

    getReservationsByVehicle(selectedVehicle.id)
      .then((data) => {
        if (!isMounted) return;
        setReservations(data);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas", error);
        if (!isMounted) return;
        setReservations([]);
        setReservationsError(
          error?.message || "No se pudieron cargar las reservas"
        );
      })
      .finally(() => {
        if (isMounted) setReservationsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedVehicle?.id]);

  const handleModalConfirm = async () => {
    if (!selectedVehicle?.id) {
      Alert.alert(
        "Selecciona un vehículo",
        "Debes elegir un vehículo antes de crear la reserva."
      );
      return;
    }

    if (!currentUser?.id) {
      Alert.alert(
        "Sesión no disponible",
        "No se pudo identificar al usuario actual. Inicia sesión nuevamente."
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
        error?.message || "No se pudo crear la reserva. Intenta nuevamente."
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
    [reservations]
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Stack.Screen
        options={{
          headerTitle: "Calendario",
        }}
      />

      <CarVisualizer
        vehicles={vehicles}
        onVehicleChange={(vehicle) => {
          setSelectedVehicle(vehicle);
        }}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#282D86"
          style={{ marginTop: 40 }}
        />
      ) : (
        selectedVehicle && (
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
        )
      )}
      {reservationsLoading && (
        <ActivityIndicator
          size="small"
          color="#282D86"
          style={{ marginTop: 10 }}
        />
      )}
      {reservationsError && (
        <Text style={{ color: "#D32F2F", marginTop: 8 }}>
          {reservationsError}
        </Text>
      )}
      <View
        style={{
          flexDirection: "column",
          gap: 20,
          width: "100%",
        }}
      >
        <Pressable
          style={styles.button}
          onPress={() => {
            navigateToReservations();
          }}
        >
          <Text style={styles.buttonText}>Ver reservas</Text>
        </Pressable>

        <Pressable
          style={styles.buttonReserve}
          onPress={() => setShowReserveModal(true)}
        >
          <Text style={styles.buttonTextReserve}> + Reservar vehículo</Text>
        </Pressable>
      </View>

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
    </ScrollView>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingVertical: 20,
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  buttonReserve: {
    backgroundColor: "#FE9000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  buttonText: {
    color: "#282D86",
    fontWeight: "bold",
    fontSize: 20,
  },

  buttonTextReserve: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },

  arrowRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 30,
  },
  arrowButton: {
    padding: 10,
  },
});
