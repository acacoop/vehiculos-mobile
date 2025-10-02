import { Stack, Redirect } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { signIn, isLoading, isAuthenticated, error } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require("../assets/logo_azul.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Portal de vehículos ACA Coop</Text>
      <Text style={styles.subtitle}>
        Ingresá con tu cuenta corporativa de Microsoft para continuar.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
        onPress={signIn}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión con Microsoft</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  logo: {
    width: 200,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#282D86",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
    lineHeight: 22,
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#282D86",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 250,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
