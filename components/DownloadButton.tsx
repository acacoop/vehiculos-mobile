import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import { IconArrowRigth } from "./Icons";

export default function DownloadButton() {
  return (
    <Pressable style={styles.Pressable}>
      <Text style={styles.text}>Titulo</Text>
      <IconArrowRigth size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Pressable: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: "bold",
  },
});
