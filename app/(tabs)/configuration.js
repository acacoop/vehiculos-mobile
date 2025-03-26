import React from "react";
import { View, StyleSheet } from "react-native";
import {
  IconUser,
  IconWallet,
  IconLock,
  IconLogout,
} from "../../components/Icons";
import { PressableButton } from "../../components/Buttons";
import { Stack } from "expo-router";

export default function Configuration() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración",
        }}
      />
      <View style={styles.containerconfig}>
        <PressableButton
          text="Usuario"
          icon={({ pressed }) => <IconUser pressed={pressed} />}
        />
        <PressableButton
          text="Credenciales"
          icon={({ pressed }) => <IconWallet pressed={pressed} />}
        />

        <PressableButton
          text="Seguridad"
          icon={({ pressed }) => <IconLock pressed={pressed} />}
        />

        <PressableButton
          text="Cerrar sesión"
          icon={({ pressed }) => <IconLogout pressed={pressed} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    flexDirection: "column",
  },
  text: {
    fontSize: 20,
  },
  containerconfig: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 50,
  },
});
