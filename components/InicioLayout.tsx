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
        <Image source={require("../assets/Logo.svg")} style={styles.image} />
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
  },
  ContainerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 100,
    backgroundColor: "black",
  },
  headerContainer: {
    width: "100%",
  },
});
