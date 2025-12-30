import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export default function RedirectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Completa cualquier sesión de auth pendiente
    WebBrowser.maybeCompleteAuthSession();

    const timer = setTimeout(() => {
      router.replace("/");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#282D86" />
      <Text style={styles.text}>Completando inicio de sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#282D86",
  },
});
