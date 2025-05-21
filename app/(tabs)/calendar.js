import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";

const availableVehicles = [
  {
    id: "1",
    licensePlate: "ABC 123",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    color: "#FE9000",
  },
  {
    id: "2",
    licensePlate: "XYZ 789",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    color: "#3498db",
  },
];

const Calendar = () => {
  const [reservations, setReservations] = useState([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(availableVehicles[0]);

  const handleConfirmReservationFromCalendar = (from, to) => {
    setReservations((prev) => [
      ...prev,
      { from, to, vehicleId: selectedVehicle.id },
    ]);
  };

  const handleConfirmReservationFromButton = (reservation) => {
    setReservations((prev) => [
      ...prev,
      { ...reservation, vehicleId: selectedVehicle.id },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.carVisualizer}>
        <CarVisualizer
          vehicles={availableVehicles}
          onVehicleChange={(vehicle) => {
            setSelectedVehicle(vehicle);
            const index = availableVehicles.findIndex(
              (v) => v.id === vehicle.id
            );
            if (index !== -1) setCurrentVehicleIndex(index);
          }}
        />
      </View>

      <Calendario
        reservations={reservations}
        selectedVehicle={selectedVehicle}
      />

      <ReserveButton onReserve={handleConfirmReservationFromButton} />
    </ScrollView>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  carVisualizer: {
    width: "85%",
    marginBottom: 20,
  },
});
