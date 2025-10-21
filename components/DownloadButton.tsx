import React from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { IconArrowRigth, IconFile } from "./Icons";

export default function DownloadButton() {
  return (
    <Pressable style={styles.Pressable}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: 100,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconFile size={24} />
        </View>
        <Text style={styles.text}>Documento.pdf</Text>
      </View>
      <IconArrowRigth size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Pressable: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#0000006c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#d3d3d3ff",
    borderWidth: 1,
    width: 350,
    gap: 20,
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: "bold",
    textAlign: "left",
  },
});
