import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import Navbar from "./Navbar";
import { IconLock, IconLogout, IconUser, IconWallet } from "./Icons";

const Configuracion = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.containerconfig}>
        <Pressable style={styles.button}>
          <IconUser />
          <Text style={styles.text}>Usuario</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <IconWallet />
          <Text style={styles.text}>Credenciales</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <IconLock />
          <Text style={styles.text}>Seguridad</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <IconLogout />
          <Text style={styles.text}>Cerrar sesión</Text>
        </Pressable>
      </View>
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
    fontSize: 19,
    color: "#333",
    fontWeight: "bold",
  },
  containerconfig: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    gap: 30,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    width: 250,
  },
});

export default Configuracion;
