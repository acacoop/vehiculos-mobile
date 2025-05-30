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
import { Ionicons } from "@expo/vector-icons";

const Calendar = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const resevations = ({ reserve }) => {
    router.push({
      pathname: "/reservations",
      params: {
        reservations: JSON.stringify(reservations),
      },
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
            resevations({ reserve: "reservations" });
          }}
        >
          <Text style={styles.buttonText}>Ver reservas</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setShowReserveModal(true)}
        >
          <Text style={styles.buttonText}>Reservar vehículo</Text>
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
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
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
