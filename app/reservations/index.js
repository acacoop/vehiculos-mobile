import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { getReservationsByVehicle } from "../../services/reservations";

const getMonthYearKey = (date) => {
  const d = new Date(date);
  return d.toLocaleString("es-ES", { month: "long", year: "numeric" });
};

const groupReservationsByMonth = (reservations) => {
  const grouped = reservations.reduce((acc, res) => {
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
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState(null);
  const [initialVehicleId, setInitialVehicleId] = useState(null);
  const [initialSelectionApplied, setInitialSelectionApplied] = useState(false);

  const coerceParam = (value) => {
    if (Array.isArray(value)) return value[0];
    return value ?? null;
  };

  useEffect(() => {
    setInitialSelectionApplied(false);
  }, [params.vehicleId, params.licensePlate]);

  useEffect(() => {
    if (!vehicles.length || initialSelectionApplied) return;

    const desiredId = coerceParam(params.vehicleId);
    const desiredPlate = coerceParam(params.licensePlate);

    if (!desiredId && !desiredPlate) {
      setInitialVehicleId((prev) => (prev === null ? prev : null));
      setInitialSelectionApplied(true);
      return;
    }

    const found = vehicles.find(
      (vehicle) =>
        (desiredId && String(vehicle.id) === String(desiredId)) ||
        (desiredPlate && vehicle.licensePlate === desiredPlate)
    );

    if (found) {
      setSelectedVehicle(found);
      setInitialVehicleId((prev) => (prev === found.id ? prev : found.id));
    }

    setInitialSelectionApplied(true);
  }, [
    vehicles,
    params.vehicleId,
    params.licensePlate,
    initialSelectionApplied,
  ]);

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

  useEffect(() => {
    getAllVehicles()
      .then((data) => {
        setVehicles(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedVehicle?.id) {
      setReservations([]);
      setReservationsLoading(false);
      return;
    }

    let isMounted = true;
    setReservationsLoading(true);
    setReservationsError(null);

    getReservationsByVehicle(selectedVehicle.id)
      .then((data) => {
        if (!isMounted) return;
        setReservations(data);
      })
      .catch((error) => {
        console.error("Error al cargar las reservas", error);
        if (!isMounted) return;
        setReservations([]);
        setReservationsError(
          error?.message || "No se pudieron obtener las reservas"
        );
      })
      .finally(() => {
        if (isMounted) setReservationsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedVehicle?.id]);

  // Date filter logic: intersection with at least one day (compare only by date)
  const mappedReservations = useMemo(
    () =>
      reservations.map((res) => ({
        id: res.id,
        from: res.startDate,
        to: res.endDate,
        licensePlate: res.licensePlate,
        vehicleId: res.vehicleId,
        vehicleLabel: `${res.vehicleBrand} ${res.vehicleModel}`.trim(),
        requesterName: `${res.user.firstName ?? ""} ${res.user.lastName ?? ""}`
          .trim()
          .replace(/\s+/g, " "),
      })),
    [reservations]
  );

  const filteredReservations = mappedReservations.filter((res) => {
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

  const sections = groupReservationsByMonth(filteredReservations);

  const handleVehicleChange = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: "Reservas", headerTitleAlign: "center" }}
      />

      <CarVisualizer
        vehicles={vehicles}
        initialVehicleId={initialVehicleId}
        onVehicleChange={handleVehicleChange}
      />

      <View style={{ flexDirection: "row", gap: 10, padding: 20 }}>
        <DatePicker value={fromDate} label="Desde" onChange={setFromDate} />
        <DatePicker value={toDate} label="Hasta" onChange={setToDate} />
      </View>
      {reservationsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#282D86" />
        </View>
      ) : reservationsError ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: "#D32F2F" }]}>
            {reservationsError}
          </Text>
        </View>
      ) : filteredReservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No existen reservas disponibles</Text>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={styles.scrollContent}
          style={{ width: "100%" }}
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.month}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <Schedule
              from={item.from}
              to={item.to}
              licensePlate={item.licensePlate}
              vehicleLabel={item.vehicleLabel}
              requesterName={item.requesterName}
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "start",
    color: "#282D86",
    marginLeft: 10,
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
