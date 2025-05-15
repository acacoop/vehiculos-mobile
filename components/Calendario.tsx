import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const generateDaysInMonth = (month: number, year: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month - 1, i));
  }
  return days;
};

export const Calendario = ({
  reservations,
}: {
  reservations: { from: Date; to: Date }[];
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const daysInMonth = generateDaysInMonth(currentMonth, currentYear);

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  };

  const isReserved = (date: Date) => {
    const current = formatDate(date);
    return reservations.some(({ from, to }) => {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const rangeStart = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate()
      );
      const rangeEnd = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate()
      );

      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      return day >= rangeStart && day <= rangeEnd;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>
        {currentDate.toLocaleString("default", { month: "long" })} {currentYear}
      </Text>

      <View style={styles.weekRow}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeek}>
            {day}
          </Text>
        ))}
      </View>

      <FlatList
        data={daysInMonth}
        renderItem={({ item }) => {
          const normalizedDate = new Date(
            item.getFullYear(),
            item.getMonth(),
            item.getDate()
          );

          return (
            <View
              style={[
                styles.dayCell,
                isReserved(normalizedDate) ? styles.reservedDay : null,
              ]}
            >
              <Text style={styles.dayText}>{item.getDate()}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.toISOString()}
        numColumns={7}
        contentContainerStyle={styles.daysContainer}
      />
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
    margin: 2,
    backgroundColor: "#ffffff33",
    borderRadius: 6,
  },
  reservedDay: {
    backgroundColor: "#FF6347", // rojo para días reservados
  },
  dayText: {
    color: "white",
  },
});
