import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import Constants from "expo-constants";
import { useApp } from "../context/AppContext";
import { IconArrowLeft } from "./Icons";
import { Link } from "expo-router";

const Header = () => {
  const { headerConfig } = useApp();

  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#282D86"
        barStyle="light-content"
        translucent={true}
      />

      {headerConfig.showBackButton && (
        <Link asChild href="/vehicles">
          <Pressable style={styles.backButton}>
            {({ pressed }) => (
              <IconArrowLeft
                pressed={pressed}
                style={{ color: pressed ? "black" : "white" }}
                size={30}
              />
            )}
          </Pressable>
        </Link>
      )}

      <Text style={styles.title}>{headerConfig.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#282D86",
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingTop:
      Constants.statusBarHeight +
      (Platform.OS === "ios" ? 20 : Platform.OS === "android" ? 25 : 20),
  },
  backButton: {
    marginRight: 10, // Espaciado entre la flecha y el título
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    flex: 1, // Empuja el título para que ocupe el centro
    textAlign: "center", // Asegura que el texto quede centrado
    marginRight: 30, // Compensa el espacio de la flecha
  },
});

export default Header;
