import { StyleSheet, View, ImageBackground } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import WarningCard from "../../components/WarningCard";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Inicio" }} />
      <ImageBackground
        source={require("../../assets/ACA_color_RGB.png")}
        style={styles.imageBackground}
        resizeMode="contain"
      >
        {/*  <View style={styles.overlay}>
          <WarningCard />
        </View> */}
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
    width: "230px",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 20,
    resizeMode: "contain",
    opacity: 0.7,
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
