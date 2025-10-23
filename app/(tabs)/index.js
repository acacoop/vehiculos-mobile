import { StyleSheet, View, ImageBackground } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import WarningCard from "../../components/WarningCard";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Inicio" }} />
      <ImageBackground
        source={require("../../assets/logo_azul.webp")}
        style={styles.imageBackground}
        resizeMode="contain"
      >
        <View style={styles.overlay}>
          <WarningCard />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageBackground: {
    width: "90%",
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
