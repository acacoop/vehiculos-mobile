import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";
import { Calendario } from "../../components/Calendario";

const Calendar = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [fromTime, setFromTime] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());

  const [reservations, setReservations] = useState([]);

  const handleConfirmReservation = ({ fromDate, fromTime, toDate, toTime }) => {
    // Guardar la reserva en el estado local
    setReservations((prev) => [
      ...prev,
      {
        from: new Date(
          fromDate.getFullYear(),
          fromDate.getMonth(),
          fromDate.getDate(),
          fromTime.getHours(),
          fromTime.getMinutes()
        ),
        to: new Date(
          toDate.getFullYear(),
          toDate.getMonth(),
          toDate.getDate(),
          toTime.getHours(),
          toTime.getMinutes()
        ),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Calendario reservations={reservations} />

      <ReserveButton
        fromDate={fromDate}
        fromTime={fromTime}
        toDate={toDate}
        toTime={toTime}
        setFromDate={setFromDate}
        setFromTime={setFromTime}
        setToDate={setToDate}
        setToTime={setToTime}
        onReserve={handleConfirmReservation}
      />
    </ScrollView>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
});
