import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { AppProvider } from "../context/AppContext";

export default function Layout() {
  return (
    <AppProvider>
      <View style={style.container}>
        <Header />
        <Slot name="layout" />
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
