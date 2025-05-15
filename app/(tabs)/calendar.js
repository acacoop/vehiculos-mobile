import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";

const Calendar = () => {
  const [reservations, setReservations] = useState([]);
  const exampleVehicle = {
    id: "1",
    licensePlate: "ABC123",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
  };

  const handleConfirmReservationFromCalendar = (from, to) => {
    setReservations((prev) => [...prev, { from, to }]);
  };

  const handleConfirmReservationFromButton = (reservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.carVisualizer}>
        <CarVisualizer vehicle={exampleVehicle} />
      </View>
      <Calendario reservations={reservations} />
      <ReserveButton onReserve={handleConfirmReservationFromButton} />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "start",
    alignItems: "center",
  },
  carVisualizer: {
    justifyContent: "start",
    alignItems: "start",
    width: "85%",
    height: "10%",
  },
});
