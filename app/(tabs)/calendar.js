import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";
import { Stack, useRouter } from "expo-router";
import { getAllVehicles } from "../../services/vehicles";
import { ReserveModal } from "../../components/ReserveModal";

const Calendar = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const navigateToReservations = ({ start, end } = {}) => {
    const params = {
      reservations: JSON.stringify(reservations),
    };
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

  const handleConfirmReservationFromCalendar = (from, to) => {
    setReservations((prev) => [
      ...prev,
      { from, to, vehicleId: selectedVehicle.id },
    ]);
  };

  const handleConfirmReservationFromButton = (reservation) => {
    setReservations((prev) => [
      ...prev,
      { ...reservation, licensePlate: selectedVehicle.licensePlate }, // Cambia vehicleId por licensePlate
    ]);
    setShowReserveModal(false);
  };

  const handleModalConfirm = () => {
    handleConfirmReservationFromButton({
      from: fromDate,
      to: toDate,
    });
  };

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
            reservations={reservations}
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
      <View
        style={{
          gap: 20,
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
  },
  button: {
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 350,
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
    borderRadius: 30,
    alignItems: "center",
    width: 350,
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
    fontWeight: "bold",
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
