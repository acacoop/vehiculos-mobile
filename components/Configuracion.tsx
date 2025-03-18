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
    backgroundColor: "#ffffff",
    paddingBottom: 100,
    flexDirection: "column",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  containerconfig: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    /* margin: 20, */
    width: 250,
    backgroundColor: "#ffffff",
  },
});

export default Configuracion;
