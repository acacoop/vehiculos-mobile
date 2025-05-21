import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../../services/vehicles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import DownloadButton from "../../../components/DownloadButton";

export default function Documentation() {
  const { documentation } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleDetail, setVehicles] = useState(null);
  useEffect(() => {
    getVehicle(documentation).then(setVehicles);
  }, [documentation]);
  if (vehicleDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Documentación" }} />
      <ScrollView
        styles={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.view}>
          <Text style={styles.Tittle}>Autorización de manejo </Text>
          <DownloadButton />
        </View>
        <View style={styles.view}>
          <Text style={styles.Tittle}>Seguro </Text>
          <DownloadButton />
        </View>
        <View style={styles.view}>
          <Text style={styles.Tittle}>Otros </Text>
          <DownloadButton />
          <DownloadButton />
          <DownloadButton />
        </View>
      </ScrollView>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollViewContainer: {
    width: "100%",
    marginBottom: 20,
  },
  Tittle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    marginTop: 30,
  },
  view: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
