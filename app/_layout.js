import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentRoot = Array.isArray(segments) ? segments[0] : undefined;
    const isLoginRoute = currentRoot === "login";

    if (!isAuthenticated && !isLoginRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isLoginRoute) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#282D86" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitle: "",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <RootNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
