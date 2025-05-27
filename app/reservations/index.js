import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Schedule } from "../../components/Schedule";
import { getAllVehicles } from "../../services/vehicles";

const getMonthYearKey = (date) => {
  const d = new Date(date);
  return d.toLocaleString("es-ES", { month: "long", year: "numeric" });
};

const groupReservationsByMonth = (reservations) => {
  return reservations.reduce((acc, res) => {
    const key = getMonthYearKey(res.from);
    if (!acc[key]) acc[key] = [];
    acc[key].push(res);
    return acc;
  }, {});
};

export default function Reservations() {
  const params = useLocalSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const grouped = groupReservationsByMonth(reservations);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Reservas" }} />
      {reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No existen reservas disponibles</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {Object.entries(grouped).map(([month, resList]) => (
            <View key={month} style={{ width: "100%" }}>
              <Text style={styles.month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </Text>
              <View style={{ width: "100%", gap: 20 }}>
                {resList.map((res, index) => (
                  <Schedule
                    key={index}
                    from={res.from}
                    to={res.to}
                    licensePlate={res.licensePlate}
                    vehicles={vehicles}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 20,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  month: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
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
