import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

export default function Reservations() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Reservas",
        }}
      />
      <Text>Configuración</Text>
    </View>
  );
}
