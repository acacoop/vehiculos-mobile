import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button, Pressable } from "react-native";

const icon = require("./assets/icon.png");

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable
        onPress={() => alert("Hola!")}
        underlayColor={"#09f"}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Touch me!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
