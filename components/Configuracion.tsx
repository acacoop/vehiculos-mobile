import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./Header";
import Navbar from "./Navbar";

const Configuracion = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Hello, React Native!</Text>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});

export default Configuracion;
