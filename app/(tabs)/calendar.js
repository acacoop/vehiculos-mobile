import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";
import { Calendario } from "../../components/Calendario";

const Calendar = () => {
  const [reservations, setReservations] = useState([]);

  const handleConfirmReservation = (from, to) => {
    setReservations((prev) => [...prev, { from, to }]);
  };

  return (
    <View contentContainerStyle={styles.container}>
      <Calendario reservations={reservations} />
      <ReserveButton onReserve={handleConfirmReservation} />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
});
