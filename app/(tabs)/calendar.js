import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";
import { Calendario } from "../../components/Calendario";
import { CarVisualizer } from "../../components/CarVisualizer";

const Calendar = () => {
  const [reservations, setReservations] = useState([]);

  const handleConfirmReservationFromCalendar = (from, to) => {
    setReservations((prev) => [...prev, { from, to }]);
  };

  const handleConfirmReservationFromButton = (reservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  return (
    <View style={styles.container}>
      <CarVisualizer />
      <Calendario reservations={reservations} />
      <ReserveButton onReserve={handleConfirmReservationFromButton} />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
});
