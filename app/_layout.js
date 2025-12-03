import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentRoot = Array.isArray(segments) ? segments[0] : undefined;
    const isLoginRoute = currentRoot === "login";
    const isRedirectRoute = currentRoot === "redirect";

    // No redirigir si estamos en la ruta de redirect (OAuth callback)
    if (isRedirectRoute) return;

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
        headerStyle: {
          paddingBottom: 10,
          backgroundColor: "#ffffff",
        },
        headerTitleAlign: "center",
        headerTintColor: "#282D86",
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="redirect" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <View style={styles.container}>
          <RootNavigator />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
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
