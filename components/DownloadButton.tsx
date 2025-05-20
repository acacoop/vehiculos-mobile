import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import { IconDownload } from "./Icons";

export default function DownloadButton() {
  return (
    <Pressable style={styles.Pressable}>
      <Text style={styles.text}>Ver documento</Text>
      <IconDownload />
    </Pressable>
  );
}

styles = StyleSheet.create({
  Pressable: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 5,
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
    width: "90%",
    gap: 20,
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: "bold",
  },
});
