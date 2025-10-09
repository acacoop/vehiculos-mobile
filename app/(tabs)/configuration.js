import React from "react";
import { View, StyleSheet, Linking, Platform } from "react-native";
import {
  IconUser,
  IconWallet,
  IconLock,
  IconLogout,
} from "../../components/Icons";
import { PressableButton } from "../../components/Buttons";
import { Stack } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Configuration() {
  const router = useRouter();
  const configButtons = ({ user }) => {
    router.push(`/configuration/${user}`);
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
        <PressableButton
          text="Usuario"
          onPress={() => configButtons({ user: "user" })}
          icon={({ pressed }) => <IconUser pressed={pressed} />}
        />
        <PressableButton
          text="Credenciales"
          icon={({ pressed }) => <IconWallet pressed={pressed} />}
          onPress={openMiArgentina}
        />

        <PressableButton
          text="Cerrar sesión"
          icon={({ pressed }) => <IconLogout pressed={pressed} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    flexDirection: "column",
  },
  text: {
    fontSize: 20,
  },
  containerconfig: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 50,
  },
});
