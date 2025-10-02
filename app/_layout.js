import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <View style={style.container}>
      <Stack
        name="layout"
        screenOptions={{
          headerStyle: { backgroundColor: "#282D86" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitle: "",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
