import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { Icon } from "../../components/Icons";
import { CardConfig } from "../../components/CardConfig";
import { getCurrentUser } from "../../services/me";
import { colors } from "../../constants/colors";

export default function UserConfig() {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Expiration dates state
  const [dniExpiration, setDniExpiration] = useState(new Date());
  const [carnetExpiration, setCarnetExpiration] = useState(new Date());

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
        setUserInfo(currentUser);
        setUserError(null);
      } catch (error) {
        console.error("No se pudo obtener la información del usuario", error);
        if (isMounted) {
          setUserInfo(null);
          setUserError("No se pudo cargar tu información");
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const userFullName = useMemo(() => {
    if (!userInfo) return "";
    const fullName = `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`
      .trim()
      .replace(/\s+/g, " ");
    return fullName || userInfo.email || "";
  }, [userInfo]);

  const userEmail = userInfo?.email ?? "";

  const renderUserName = () => {
    if (loadingUser) return "Cargando nombre...";
    if (userError) return userError;
    return userFullName || "Nombre no disponible";
  };

  const renderUserEmail = () => {
    if (loadingUser) return "Cargando correo...";
    if (userError) return "Correo no disponible";
    return userEmail || "Correo no disponible";
  };

  const formatDate = (date) => {
    if (!date) return "Configurar vencimiento";
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración usuario",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <View style={styles.containerconfig}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Información personal</Text>
        </View>

        <CardConfig
          title="Nombre"
          description={renderUserName()}
          icon={<Icon name="user" size={24} />}
          showArrow={false}
        />
        <CardConfig
          title="Email"
          description={renderUserEmail()}
          icon={<Icon name="mail-outline" size={24} />}
          showArrow={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  containerconfig: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    paddingTop: 10,
  },
  sectionHeader: {
    textAlign: "left",
    width: "90%",
    marginTop: 10,
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
});
