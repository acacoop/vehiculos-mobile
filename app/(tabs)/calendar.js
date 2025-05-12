import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ReserveButton } from "../../components/ReserveButton";

// Componente para crear un calendario simple
const Calendar = () => {
  // Días de la semana
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Generar los días del mes (28, 29, 30 o 31 días dependiendo del mes)
  const generateDaysInMonth = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Devuelve la cantidad de días del mes
    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Obtener la fecha actual
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.
  const currentYear = currentDate.getFullYear();

  // Obtener los días del mes actual
  const daysInMonth = generateDaysInMonth(currentMonth + 1, currentYear);

  // Renderizar el calendario
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.container}>
        {/* Título del mes */}
        <Text style={styles.monthTitle}>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentYear}
        </Text>

        {/* Días de la semana */}
        <View style={styles.weekRow}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.dayOfWeek}>
              {day}
            </Text>
          ))}
        </View>

        {/* Días del mes */}
        <FlatList
          data={daysInMonth}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.dayCell,
                {
                  marginLeft: index % 7 === 0 ? 0 : 10, // Nueva fila al llegar a cada inicio de semana
                },
              ]}
            >
              <Text style={styles.dayText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item.toString()}
          numColumns={7} // 7 días en una semana
          contentContainerStyle={styles.daysContainer}
        />
      </View>
      <ReserveButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#282D86",
    borderRadius: 10,
    margin: 20,
    paddingBottom: 20,
    justifyContent: "center",
    width: "90%",
  },
  monthTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dayOfWeek: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    width: 30,
  },
  daysContainer: {
    alignItems: "center",
  },
  dayCell: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#FE9000",
    marginBottom: 10,
  },
  dayText: {
    color: "white",
    fontSize: 14,
  },
});

export default Calendar;
