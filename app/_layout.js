import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import { AppProvider } from "../context/AppContext";

export default function Layout() {
  return (
    <AppProvider>
      <View style={style.container}>
        <Stack
          name="layout"
          screenOptions={{
            headerStyle: { backgroundColor: "#282D86" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "bold" },
            headerTitle: "",
          }}
        />
        <Navbar />
      </View>
    </AppProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
