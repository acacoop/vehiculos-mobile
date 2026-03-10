import React from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { Icon } from "./Icons";
import { colors } from "../constants/colors";

export default function DownloadButton() {
  return (
    <Pressable style={styles.Pressable}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View
          style={{
            backgroundColor: colors.backgroundLight,
            borderRadius: 100,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="filetext1" size={24} />
        </View>
        <Text style={styles.text}>Documento.pdf</Text>
      </View>
      <Icon name="right" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Pressable: {
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: colors.borderDark,
    borderWidth: 1,
    width: "100%",
    gap: 20,
  },
  text: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "left",
  },
});
