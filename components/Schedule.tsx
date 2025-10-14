import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconCalendar, IconCar, IconUser } from "./Icons";
import { getCurrentUser } from "../services/me";

interface ScheduleProps {
  from: Date;
  to: Date;
  licensePlate: string;
  vehicleLabel?: string;
  requesterName?: string | null;
}

export function Schedule({
  from,
  to,
  licensePlate,
  vehicleLabel,
  requesterName,
}: ScheduleProps) {
  const [fallbackRequester, setFallbackRequester] = useState<string | null>(
    requesterName ?? null
  );
  const [loadingRequester, setLoadingRequester] = useState(!requesterName);

  useEffect(() => {
    if (requesterName) {
      setFallbackRequester(requesterName);
      setLoadingRequester(false);
      return;
    }

    let isMounted = true;
    setLoadingRequester(true);

    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted) return;

        if (currentUser) {
          const fullName =
            `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`
              .trim()
              .replace(/\s+/g, " ");
          if (fullName) {
            setFallbackRequester(fullName);
          } else if (currentUser.email) {
            setFallbackRequester(currentUser.email);
          } else {
            setFallbackRequester(null);
          }
        } else {
          setFallbackRequester(null);
        }
      } catch (error) {
        console.error("No se pudo obtener el solicitante", error);
        if (isMounted) {
          setFallbackRequester(null);
        }
      } finally {
        if (isMounted) {
          setLoadingRequester(false);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [requesterName]);

  const requesterLabel = loadingRequester
    ? "Cargando solicitante..."
    : (fallbackRequester ?? "Solicitante no disponible");

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Detalles de la Reserva</Text>
        <View style={styles.containerImage}>
          <IconCar size={25} color="#fe9000" />
        </View>
      </View>

      {vehicleLabel ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaValue} numberOfLines={2}>
            {vehicleLabel}
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View style={styles.containerImage}>
          <IconCalendar color="#282D86" />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.subTitle}>Inicio de la reserva</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {from.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </Text>
            <Text style={styles.text}>-</Text>
            <Text style={styles.text}>
              {from.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View style={styles.containerImage}>
          <IconCalendar color="#282D86" />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.subTitle}>Fin de la reserva</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {to.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </Text>
            <Text style={styles.text}>-</Text>
            <Text style={styles.text}>
              {to.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View style={styles.containerImage}>
          <IconUser />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.subTitle}>Solicitante</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text} numberOfLines={2}>
              {requesterLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#00000075",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  itemContainer: {
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#282D86",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#282D86",
  },

  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#282D86",
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#f1f1f1ff",
    borderRadius: "100%",
    padding: 5,
  },
});
