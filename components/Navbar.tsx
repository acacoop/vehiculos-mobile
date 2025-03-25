import { StyleSheet, View, Pressable } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { IconCar, IconSetting, IconCalendar } from "./Icons";

const Navbar = () => {
  return (
    <View style={styles.container}>
      <Link asChild href="/vehicles">
        <Pressable style={styles.button}>
          {({ pressed }) => (
            <IconCar
              pressed={pressed}
              style={{ color: pressed ? "#FE9000" : "white" }}
            />
          )}
        </Pressable>
      </Link>
      <Link asChild href="/">
        <Pressable style={styles.button}>
          {({ pressed }) => (
            <IconCalendar
              pressed={pressed}
              style={{ color: pressed ? "#FE9000" : "white" }}
            />
          )}
        </Pressable>
      </Link>
      <Link asChild href="/configuration">
        <Pressable style={styles.button}>
          {({ pressed }) => (
            <IconSetting
              pressed={pressed}
              style={{ color: pressed ? "#FE9000" : "white" }}
            />
          )}
        </Pressable>
      </Link>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 70,
    backgroundColor: "#282D86",
    width: "100%",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 0,
  },
  button: {
    padding: 20,
  },
});
