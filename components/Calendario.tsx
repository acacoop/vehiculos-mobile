import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Vehicle } from "../interfaces/vehicle";
import { Icon } from "./Icons";

const daysOfWeek = ["D", "L", "Ma", "Mi", "J", "V", "S"];
const CELL_WIDTH = 42;
const CELL_HEIGHT = 34;
const MAX_WEEK_ROWS = 6;
const GRID_GAP = 4;
const GRID_ROW_COUNT = MAX_WEEK_ROWS + 1; // header row + week rows
const GRID_WIDTH = CELL_WIDTH * 7 + 14;
const GRID_HEIGHT =
  GRID_ROW_COUNT * CELL_HEIGHT + GRID_GAP * (GRID_ROW_COUNT - 1);

const generateWeeksInMonth = (month: number, year: number) => {
  const totalDays = new Date(year, month, 0).getDate();
  const weeks: Date[][] = [];
  let week: Date[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month - 1, day);
    week.push(date);

    if (date.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  return weeks;
};

export const Calendario = ({
  reservations,
  selectedVehicle,
  onDayPress, // <-- add this prop
}: {
  reservations: {
    from: Date;
    to: Date;
    vehicleId: string;
    licensePlate: string;
  }[];
  selectedVehicle: Vehicle;
  onDayPress?: (date: Date) => void;
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const weeks = generateWeeksInMonth(currentMonth, currentYear);
  const DEFAULT_RESERVATION_COLOR = "#cdd4ffdc";

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const isReserved = (date: Date) => {
    if (!selectedVehicle) return false;
    const current = formatDate(date);
    return reservations.some((reservation) => {
      if (reservation.licensePlate !== selectedVehicle.licensePlate)
        return false;
      const from = formatDate(new Date(reservation.from));
      const to = formatDate(new Date(reservation.to));
      return current >= from && current <= to;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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

  const handleMoveToToday = () => {
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleMoveToToday}
          style={{
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 15,
            elevation: 1,
            shadowColor: "#000000f6",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 1.41,
            borderColor: "#ddd",
            borderWidth: 1,
            backgroundColor: "#ffff",
          }}
        >
          <Text style={{ color: "#282D86", fontWeight: "bold", fontSize: 16 }}>
            Hoy
          </Text>
        </TouchableOpacity>
        <Icon
          name="left"
          onPress={goToPreviousMonth}
          size={20}
          color="#282D86"
        />

        <View
          style={{
            justifyContent: "center",
            alignSelf: "center",
            flex: 1,
          }}
        >
          <Text style={styles.monthTitle}>
            {new Date(currentYear, currentMonth - 1)
              .toLocaleString("es-ES", { month: "long" })
              .replace(/^./, (c) => c.toUpperCase())}{" "}
            {currentYear.toString().slice(-2)}
          </Text>
        </View>

        <Icon name="right" onPress={goToNextMonth} size={20} color="#282D86" />
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.weekRow, styles.gridRow]}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayOfWeek}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.weeksWrapper}>
          {weeks.map((week, index) => (
            <View
              key={index}
              style={[
                styles.weekRow,
                styles.gridRow,
                index === 0
                  ? { justifyContent: "flex-end" }
                  : index === weeks.length - 1
                    ? { justifyContent: "flex-start" }
                    : { justifyContent: "center" },
              ]}
            >
              {week.map((day) => (
                <Pressable
                  key={day.toISOString()}
                  onPress={() => onDayPress && onDayPress(day)}
                  style={[
                    styles.dayCell,
                    isReserved(day)
                      ? {
                          backgroundColor:
                            selectedVehicle?.color || DEFAULT_RESERVATION_COLOR,
                        }
                      : null,
                    isToday(day) ? { backgroundColor: "#282D86" } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday(day)
                        ? {
                            color: DEFAULT_RESERVATION_COLOR,
                            fontWeight: "bold",
                          }
                        : { color: "#282D86" },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffff",
    borderRadius: 10,
    gap: 2,
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  navButton: {
    backgroundColor: "#282d8621",
    fontSize: 24,
    color: "#282D86",
    borderRadius: 100,
  },
  monthTitle: {
    fontSize: 18,
    color: "#282D86",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 36,
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    justifyContent: "center",
  },
  gridContainer: {
    width: "100%",
    alignItems: "center",
    height: GRID_HEIGHT,
    marginTop: 12,
    justifyContent: "flex-start",
  },
  weeksWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: GRID_GAP,
  },
  gridRow: {
    width: GRID_WIDTH,
    alignSelf: "center",
  },
  dayOfWeek: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    fontSize: 16,
    color: "#282D86",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
  dayCell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: "#ffffff33",
    borderRadius: 6,
  },
  dayText: {
    color: "#282D86",
  },
});
