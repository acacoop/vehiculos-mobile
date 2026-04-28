import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Table } from "../../../../components/Table";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../../../../constants/colors";
import { DatePicker } from "../../../../components/DatePicker";
import { BottomActionButton } from "../../../../components/BottomActionButton";
import { createMaintenanceRecord } from "../../../../services/maintenanceRecords";
import { getCurrentUser } from "../../../../services/me";
import { useToast } from "../../../../hooks/useToast";

const coerceParam = (param, fallback = "") => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

export default function AddMaintenance() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const maintenanceId = coerceParam(params.maintenanceId, "");
  const vehicleId = coerceParam(params.vehicleId, "");
  const maintenanceName = coerceParam(params.maintenanceName, "");
  const maintenanceCategoryName = coerceParam(
    params.maintenanceCategoryName,
    "",
  );
  const kilometersFrequency = coerceParam(params.kilometersFrequency, "");

  const toast = useToast();
  const [userId, setUserId] = useState(null);
  const [date, setDate] = useState(() => new Date());
  const [kilometers, setKilometers] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((user) => {
        if (!isMounted) return;
        setUserId(user?.id ?? null);
      })
      .catch((error) => {
        console.error("Error obteniendo el usuario actual", error);
        if (isMounted) setUserId(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!maintenanceId || !vehicleId) {
      setFormError(
        "No se pudo identificar el mantenimiento o vehículo seleccionado. Vuelve atrás e inténtalo nuevamente.",
      );
    } else {
      setFormError(null);
    }
  }, [maintenanceId, vehicleId]);

  const resetForm = () => {
    setDate(new Date());
    setKilometers("");
    setDescription("");
  };

  const handleSubmit = async () => {
    const trimmedDescription = description.trim();
    const parsedKilometers = Number.parseFloat(
      kilometers.replace(/[^0-9.,]/g, "").replace(/,/g, "."),
    );

    if (!maintenanceId || !vehicleId) {
      Alert.alert(
        "Mantenimiento no disponible",
        "No se puede registrar el mantenimiento porque falta el identificador del mantenimiento o vehículo.",
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        "Sesión expirada",
        "No se pudo identificar al usuario actual. Inicia sesión nuevamente.",
      );
      return;
    }

    if (!trimmedDescription || Number.isNaN(parsedKilometers)) {
      Alert.alert(
        "Datos incompletos",
        "Por favor completa todos los campos obligatorios.",
      );
      return;
    }

    if (parsedKilometers <= 0) {
      Alert.alert(
        "Kilómetros inválidos",
        "Los kilómetros deben ser mayores a cero.",
      );
      return;
    }

    const payload = {
      maintenanceId,
      vehicleId,
      userId,
      date,
      kilometers: parsedKilometers,
      notes: trimmedDescription,
    };

    try {
      setIsSubmitting(true);
      await createMaintenanceRecord(payload);
      toast.success({
        title: "Mantenimiento registrado",
        message: "El registro se guardó correctamente.",
      });
      resetForm();
      router.back();
    } catch (error) {
      console.error("Error al crear el mantenimiento", error);
      Alert.alert(
        "Error al registrar",
        error instanceof Error
          ? error.message
          : "No se pudo guardar el mantenimiento. Intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Registrar mantenimiento",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Table
          data={{
            Nombre: maintenanceName || "Nombre no disponible",
            Tipo: maintenanceCategoryName || "Tipo no disponible",
          }}
        />

        <View style={styles.formRow}>
          <Text style={styles.sectionTitle}>Fecha del mantenimiento</Text>
          <DatePicker
            label="Fecha"
            value={date}
            onChange={setDate}
            containerStyle={styles.datePicker}
          />

          <Text style={styles.sectionTitle}>Kilómetros actuales</Text>
          <TextInput
            placeholder="Kilómetros actuales"
            value={kilometers}
            onChangeText={setKilometers}
            style={styles.input}
            keyboardType="numeric"
            inputMode="numeric"
          />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <TextInput
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
      </ScrollView>
      <BottomActionButton
        text="Guardar"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Guardando"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  disabledInputs: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
    color: colors.textDarkAlt,
    fontWeight: "600",
  },
  formRow: {
    flexDirection: "column",
    justifyContent: "start",
    backgroundColor: colors.white,
    gap: 20,
    padding: 20,
    borderRadius: 20,
    borderColor: colors.borderLight,
    borderWidth: 1,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  datePicker: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.textDarkAlt,
    borderColor: colors.borderDark,
    borderWidth: 1,
  },
  multilineInput: {
    minHeight: 120,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textDarkAlt,
    fontStyle: "italic",
  },
});
