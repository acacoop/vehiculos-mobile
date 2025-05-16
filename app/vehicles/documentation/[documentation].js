import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function Documentation() {
  const { documentation } = useLocalSearchParams();
  const router = useRouter();

  const docs = documentation || [
    { tipo: "Cédula verde", vencimiento: "2025-03-10" },
    { tipo: "Seguro", vencimiento: "2024-12-01" },
    { tipo: "VTV", vencimiento: "2024-09-15" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Documentación del Vehículo</Text>
      {docs.map((doc, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.label}>{doc.tipo}</Text>
          <Text style={styles.value}>Vencimiento: {doc.vencimiento}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#333",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  value: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
});
