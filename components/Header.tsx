import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import Constants from "expo-constants";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#282D86"
        barStyle="light-content"
        translucent={true}
      />
      <Text style={styles.user}>Hola @user</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#282D86",
    borderBottomEndRadius: 70,
    borderBottomStartRadius: 70,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingTop:
      Platform.OS === "ios"
        ? Constants.statusBarHeight + 20
        : Constants.statusBarHeight, // Ajuste para iOS
  },
  user: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default Header;
