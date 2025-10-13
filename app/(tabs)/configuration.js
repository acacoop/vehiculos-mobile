import React from "react";
import { View, StyleSheet, Linking, Platform, Text } from "react-native";
import { IconUser, IconWallet, IconLogout } from "../../components/Icons";
import { CardConfig } from "../../components/CardConfig";
import { PressableButton } from "../../components/Buttons";
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
    const appUrl = "miargentina://";
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=ar.gob.mincyt.miargentina";
    const appStoreUrl =
      "https://apps.apple.com/ar/app/mi-argentina/id1235195816";
    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(
          Platform.OS === "ios" ? appStoreUrl : playStoreUrl
        );
      }
    } catch (e) {
      await Linking.openURL(Platform.OS === "ios" ? appStoreUrl : playStoreUrl);
    }
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
          icon={<IconUser />}
          onPress={() => configButtons({ user: "user" })}
        />
        <CardConfig
          title="Credenciales"
          description="Consulta con MiArgentina los documentos disponibles"
          icon={<IconWallet />}
          onPress={openMiArgentina}
        />
        <PressableButton
          text="Cerrar sesión"
          icon={({ pressed }) => <IconLogout pressed={pressed} />}
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
