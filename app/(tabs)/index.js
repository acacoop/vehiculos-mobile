import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Inicio" }} />
      <View style={styles.content}>
        <Image
          source={require("../../assets/ACA_color_RGB.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: "70%",
    height: "40%",
    opacity: 0.15,
  },
});
