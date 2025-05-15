import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const daysOfWeek = ["D", "L", "M", "Mi", "J", "V", "S"];
const CELL_WIDTH = 42;

const generateDaysInMonth = (month: number, year: number) => {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push(new Date(year, month - 1, day));
  }

  return days;
};

export const Calendario = ({
  reservations,
}: {
  reservations: { from: Date; to: Date }[];
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = generateDaysInMonth(currentMonth, currentYear);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const isReserved = (date: Date) => {
    const current = formatDate(date);
    return reservations.some((reservation) => {
      const from = formatDate(new Date(reservation.from));
      const to = formatDate(new Date(reservation.to));
      return current >= from && current <= to;
    });
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.navButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {new Date(currentYear, currentMonth - 1).toLocaleString("es-ES", {
            month: "long",
          })}{" "}
          {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.navButton}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeek}>
            {day}
          </Text>
        ))}
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", height: 200 }}
      >
        <FlatList
          data={daysInMonth}
          numColumns={7}
          renderItem={({ item, index }) => {
            if (!item) {
              return (
                <View
                  key={`empty-${index}`}
                  style={[styles.dayCell, { backgroundColor: "transparent" }]}
                />
              );
            }

            return (
              <View
                style={[
                  styles.dayCell,
                  isReserved(item) ? styles.reservedDay : null,
                ]}
              >
                <Text style={styles.dayText}>{item.getDate()}</Text>
              </View>
            );
          }}
          keyExtractor={(item, index) =>
            item ? item.toISOString() : `empty-${index}`
          }
          contentContainerStyle={styles.daysContainer}
        />
      </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navButton: {
    fontSize: 24,
    color: "white",
    paddingHorizontal: 10,
  },
  monthTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dayOfWeek: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    width: CELL_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  daysContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  dayCell: {
    width: CELL_WIDTH,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: "#ffffff33",
    borderRadius: 6,
  },
  reservedDay: {
    backgroundColor: "#FF6347",
  },
  dayText: {
    color: "white",
  },
});
