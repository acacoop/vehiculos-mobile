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
import { colors } from "../constants/colors";

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
          <Text style={styles.title}>ACACOOP Gestión Operativa</Text>
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
              <ActivityIndicator color={colors.white} />
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
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 8,
    shadowColor: colors.shadow,
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
    color: colors.primary,
    textAlign: "center",
  },

  containerText: {
    width: "95%",
    gap: 20,
    alignItems: "center",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 22,
  },
  error: {
    color: colors.errorDark,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 200,
    gap: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
