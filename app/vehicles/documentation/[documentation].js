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
import { IconDownload } from "../../../components/Icons";

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
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.Tittle}>Autorización de manejo </Text>
          <Pressable style={styles.Pressable}>
            <Text style={styles.text}>Ver documento</Text>
            <IconDownload />
          </Pressable>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.Tittle}>Seguro </Text>
          <Pressable style={styles.Pressable}>
            <Text style={styles.text}>Ver documento</Text>
            <IconDownload />
          </Pressable>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.Tittle}>Otros </Text>
          <Pressable style={styles.Pressable}>
            <Text style={styles.text}>Ver documento</Text>
            <IconDownload />
          </Pressable>
          <Pressable style={styles.Pressable}>
            <Text style={styles.text}>Ver documento</Text>
            <IconDownload />
          </Pressable>
          <Pressable style={styles.Pressable}>
            <Text style={styles.text}>Ver documento</Text>
            <IconDownload />
          </Pressable>
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
  },
  Tittle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    marginTop: 30,
  },
  Pressable: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    gap: 20,
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
