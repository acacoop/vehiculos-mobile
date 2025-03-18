import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import Navbar from "./Navbar";
import Constants from "expo-constants";
import Header from "./Header";

const InicioLayout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.ContainerImage}>
        <Image
          source={require("../assets/Logo ACA.png")}
          style={styles.image}
        />
      </View>
      <Navbar />
    </View>
  );
};

export default InicioLayout;

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
  headerContainer: {
    width: "100%",
  },
});
