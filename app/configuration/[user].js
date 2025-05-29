import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { FileUploader } from "../../components/FileUploader";
import { IconUser, IconArrowRigth } from "../../components/Icons";

export default function UserConfig() {
  const { user } = useLocalSearchParams;
  const router = useRouter();
  // const [UserConfig, setUser] = useState(null);

  const handleFileSelected = (file) => {
    console.log("Archivo seleccionado:", file);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración Usuario",
        }}
      />
      <View style={styles.pressable}>
        <View
          style={{
            backgroundColor: "#FE9000",
            borderRadius: 50,
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <IconUser size={24} color="white" />
        </View>

        <Text style={styles.text}>Nombre y Apellido</Text>
      </View>
      <View style={styles.pressable}>
        <Text style={styles.text}>ejemplocorreo@acacoop.com</Text>
      </View>
      <Pressable style={styles.pressable}>
        <Text style={styles.text}>DNI</Text>
        <Text style={styles.text}>
          <IconArrowRigth size={24} color="white" />
        </Text>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Text style={styles.text}>Carnet de conducir</Text>
        <Text style={styles.text}>
          {" "}
          <IconArrowRigth size={24} color="white" />
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: 500,
    textAlign: "center",
  },
  pressable: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
