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
          source={require("../../assets/Logo ACA.png")}
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
    backgroundColor: "#ffffff",
  },
  ContainerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    width: "100%",
  },
});
