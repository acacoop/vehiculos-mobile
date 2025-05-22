import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

export default function UserConfig() {
  const { user } = useLocalSearchParams;
  const router = useRouter();
  // const [UserConfig, setUser] = useState(null);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración Usuario",
        }}
      />
      <Text>Configuración</Text>
    </View>
  );
}
