import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Inicio",
        }}
      />
      <View style={styles.ContainerImage}>
        <Image
          source={require("../assets/Logo ACA.png")}
          style={styles.image}
        />
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
    paddingBottom: 100,
  },
  ContainerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  headerContainer: {},
});
