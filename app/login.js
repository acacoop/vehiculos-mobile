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
      <View style={styles.loginContainer}>
        <Image
          source={require("../assets/logo_azul.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.containerText}>
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
            <Image
              source={require("../assets/microsoft.webp")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </Pressable>
        </View>
        <View />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 24,
  },

  loginContainer: {
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  logo: {
    width: 200,
    height: 120,
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    color: "#282D86",
    textAlign: "center",
  },

  containerText: {
    width: "95%",
    gap: 20,
    alignItems: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 22,
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#282D86",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
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
