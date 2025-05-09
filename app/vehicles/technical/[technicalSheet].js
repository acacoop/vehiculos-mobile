import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function TechnicalSheet() {
  const { technicalsheet } = useLocalSearchParams();
  const router = useRouter();
  const []
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Ficha técnica vehicular" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.categoryTitle}>Ficha técnica vehicular</Text>
        <View style={{ width: "100%", gap: 10, marginBottom: 10 }}>
          <Text>Nombre del vehículo</Text>
          <Text>Marca</Text>
          <Text>Modelo</Text>
          <Text>Año</Text>
          <Text>Color</Text>
          <Text>Placa</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
});
