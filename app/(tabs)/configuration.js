import React from "react";
import { View, StyleSheet, Linking, Platform, Text } from "react-native";
import { Icon } from "../../components/Icons";
import { CardConfig } from "../../components/CardConfig";
import { Button } from "../../components/Buttons";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function Configuration() {
  const router = useRouter();
  const { signOut } = useAuth();
  const configButtons = ({ user }) => {
    router.push(`/configuration/${user}`);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const openMiArgentina = async () => {
    const androidPackage = "ar.gob.androides";
    const iosAppId = "1435736780";

    // Esquemas para abrir la tienda nativa directamente
    const androidUrl = `market://details?id=${androidPackage}`;
    const iosUrl = `itms-apps://itunes.apple.com/app/id${iosAppId}?action=write-review`;

    // URLs Web (Fallback por si falla la tienda nativa)
    const androidWebUrl = `https://play.google.com/store/apps/details?id=${androidPackage}`;
    const iosWebUrl = `https://apps.apple.com/ar/app/mi-argentina/id${iosAppId}`;

    try {
      // Determinar la URL según el SO
      const url = Platform.OS === "ios" ? iosUrl : androidUrl;
      const fallbackUrl = Platform.OS === "ios" ? iosWebUrl : androidWebUrl;

      // Intentar abrir la tienda nativa
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // Si falla (ej: en un simulador), abrir el navegador
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.error("Error al abrir el link:", error);
      Alert.alert("Error", "No se pudo abrir la tienda de aplicaciones.");
    }
  };

  const openSupportPortal = async () => {
    await Linking.openURL(
      "https://acacoop.atlassian.net/servicedesk/customer/portals",
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración",
        }}
      />
      <View style={styles.containerconfig}>
        <View style={{ textAlign: "start", width: "90%", marginTop: 20 }}>
          <Text style={styles.text}>Cuenta</Text>
        </View>
        <CardConfig
          title="Información de la cuenta"
          description="Gestionar Información de la cuenta"
          icon={<Icon name="user" size={24} />}
          onPress={() => configButtons({ user: "user" })}
        />
        <CardConfig
          title="Credenciales"
          description="Consulta con MiArgentina los documentos disponibles"
          icon={<Icon name="wallet" size={24} />}
          onPress={openMiArgentina}
        />
        <View style={{ textAlign: "start", width: "90%", marginTop: 20 }}>
          <Text style={styles.text}>Soporte</Text>
        </View>
        <CardConfig
          title="Contacto"
          description="Contáctanos para soporte o sugerencias"
          icon={<Icon name="question" size={24} />}
          onPress={openSupportPortal}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Button
          width="90%"
          text="Cerrar sesión"
          contentAlign="center"
          icon={({ pressed, color }) => (
            <Icon name="logout" pressed={pressed} size={24} />
          )}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "#f9f9f9",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#282D86",
  },
  containerconfig: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
});
