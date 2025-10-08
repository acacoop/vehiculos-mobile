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
    getVehicle(documentation).then((v) => setVehicles(v || null));
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
      <Stack.Screen
        options={{ headerTitle: "Documentación", headerTitleAlign: "center" }}
      />
      <ScrollView
        styles={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.tittleContainer}>
          <Text style={styles.Tittle}>Autorización de manejo </Text>
          <View style={styles.view}>
            <DownloadButton />
          </View>
        </View>
        <View style={styles.tittleContainer}>
          <Text style={styles.Tittle}>Seguro</Text>
          <View style={styles.view}>
            <DownloadButton />
          </View>
        </View>
        <View style={styles.tittleContainer}>
          <Text style={styles.Tittle}>Otros </Text>
          <View style={styles.view}>
            <DownloadButton />
            <DownloadButton />
            <DownloadButton />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollViewContainer: {
    width: "100%",
  },
  Tittle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    marginTop: 30,
    textAlign: "start",
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
  tittleContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 20,
  },
});
