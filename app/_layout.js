import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/Toast/toastConfig";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { colors } from "../constants/colors";

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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleAlign: "center",
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        headerBackTitle: "",
        headerBackTitleVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="redirect" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={colors.white} />
        <View style={styles.container}>
          <RootNavigator />
        </View>
        <Toast config={toastConfig} />
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
    backgroundColor: colors.white,
  },
});
