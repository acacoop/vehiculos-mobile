import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getVehicle } from "../../../services/vehicles";
import { Stack, useLocalSearchParams } from "expo-router";
import DownloadButton from "../../../components/DownloadButton";

export default function Documentation() {
  const { documentation } = useLocalSearchParams();
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
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Autorización de manejo </Text>
            <View style={styles.view}>
              <DownloadButton />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Seguro</Text>
            <View style={styles.view}>
              <DownloadButton />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Otros </Text>
            <View style={styles.view}>
              <DownloadButton />
              <DownloadButton />
              <DownloadButton />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollViewContainer: {
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    gap: 30,
    paddingBottom: 20,
    width: "100%",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    marginTop: 30,
    alignSelf: "flex-start",
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
  titleContainer: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
