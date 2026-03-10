import { StyleSheet, View, Image, ScrollView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../constants/colors";
import WarningCard from "../../components/WarningCard";

export default function Index() {
  // Datos hardcodeados de ejemplo
  const warnings = [
    {
      id: 1,
      message: "El mantenimiento de Cambio de aceite está próximo a vencer.",
    },
    { id: 2, message: "La VTV del vehículo ABC-123 vence en 15 días." },
    { id: 3, message: "El seguro del vehículo XYZ-789 está por vencer." },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Inicio" }} />

      {/* Logo de fondo fijo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/ACA_color_RGB.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Contenido scrolleable encima */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/*  {warnings.map((warning) => (
          <WarningCard key={warning.id} message={warning.message} />
        ))} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  logo: {
    width: "70%",
    height: "40%",
    opacity: 0.15,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
});
