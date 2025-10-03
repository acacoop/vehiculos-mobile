import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { Schedule } from "../../components/Schedule";
import { getAllVehicles } from "../../services/vehicles";
import { DatePicker } from "../../components/DatePicker";
import { CarVisualizer } from "../../components/CarVisualizer";

const getMonthYearKey = (date) => {
  const d = new Date(date);
  return d.toLocaleString("es-ES", { month: "long", year: "numeric" });
};

const groupReservationsByMonth = (reservations, selectedVehicle) => {
  const filtered = selectedVehicle
    ? reservations.filter(
        (res) => res.licensePlate === selectedVehicle.licensePlate
      )
    : reservations;

  const grouped = filtered.reduce((acc, res) => {
    const key = getMonthYearKey(res.from);
    if (!acc[key]) acc[key] = [];
    acc[key].push(res);
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, data]) => ({
    title: title.charAt(0).toUpperCase() + title.slice(1),
    data,
  }));
};

export default function Reservations() {
  const params = useLocalSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set selectedVehicle from vehicleId param after vehicles are loaded
  useEffect(() => {
    if (params.vehicleId && vehicles.length > 0) {
      const found = vehicles.find((v) => v.id == params.vehicleId);
      if (found) setSelectedVehicle(found);
    }
  }, [params.vehicleId, vehicles]);

  // Parse start and end from params, fallback to today 00:00 and 6 months after
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initialFrom = params.start ? new Date(params.start) : today;
  const initialTo = params.end
    ? new Date(params.end)
    : (() => {
        const d = new Date(initialFrom);
        d.setMonth(d.getMonth() + 6);
        return d;
      })();

  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);

  const reservations = params.reservations
    ? JSON.parse(params.reservations).map((r) => ({
        ...r,
        from: new Date(r.from),
        to: new Date(r.to),
      }))
    : [];

  useEffect(() => {
    getAllVehicles()
      .then((data) => {
        setVehicles(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Date filter logic: intersection with at least one day (compare only by date)
  const filteredReservations = reservations.filter((res) => {
    if (!fromDate || !toDate) return true;
    // Compare only by date (ignore time)
    const resFrom = new Date(res.from);
    resFrom.setHours(0, 0, 0, 0);
    const resTo = new Date(res.to);
    resTo.setHours(23, 59, 59, 999);
    const filterFrom = new Date(fromDate);
    filterFrom.setHours(0, 0, 0, 0);
    const filterTo = new Date(toDate);
    filterTo.setHours(23, 59, 59, 999);
    return resFrom <= filterTo && resTo >= filterFrom;
  });

  const sections = groupReservationsByMonth(
    filteredReservations,
    selectedVehicle
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Reservas" }} />

      <CarVisualizer
        vehicles={vehicles}
        onVehicleChange={(vehicle) => {
          setSelectedVehicle(vehicle);
        }}
      />

      <View style={{ flexDirection: "row", gap: 10, padding: 20 }}>
        <DatePicker value={fromDate} label="Desde" onChange={setFromDate} />
        <DatePicker value={toDate} label="Hasta" onChange={setToDate} />
      </View>

      {filteredReservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No existen reservas disponibles</Text>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={styles.scrollContent}
          style={{ width: "100%" }}
          sections={sections}
          keyExtractor={(item, index) => item.licensePlate + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.month}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <Schedule
              from={item.from}
              to={item.to}
              licensePlate={item.licensePlate}
              vehicles={vehicles}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  month: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#282D86",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    color: "#282D86",
    textAlign: "center",
    fontWeight: "bold",
  },
});
