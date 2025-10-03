import { StyleSheet, View, ImageBackground } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import WarningCard from "../../components/WarningCard";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Inicio" }} />
      <View style={styles.ContainerImage}>
        <ImageBackground
          source={require("../../assets/logo_azul.webp")}
          style={styles.background}
          resizeMode="contain"
        >
          <View style={styles.overlay}>
            <WarningCard />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  ContainerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  background: {
    width: 300,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 20,
    paddingTop: 20,
  },
});
