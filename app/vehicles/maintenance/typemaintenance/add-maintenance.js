import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { DatePicker } from "../../../../components/DatePicker";
import { createMaintenanceRecord } from "../../../../services/maintenanceRecords";
import { getCurrentUser } from "../../../../services/me";

const coerceParam = (param, fallback = "") => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

export default function AddMaintenance() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const assignedMaintenanceId = coerceParam(params.assignedMaintenanceId, "");
  const maintenanceName = coerceParam(params.maintenanceName, "");
  const maintenanceCategoryName = coerceParam(
    params.maintenanceCategoryName,
    ""
  );
  const kilometersFrequency = coerceParam(params.kilometersFrequency, "");

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
    if (!assignedMaintenanceId) {
      setFormError(
        "No se pudo identificar el mantenimiento seleccionado. Vuelve atrás e inténtalo nuevamente."
      );
    } else {
      setFormError(null);
    }
  }, [assignedMaintenanceId]);

  const maintenanceSummary = useMemo(() => {
    const lines = [];
    if (kilometersFrequency) {
      lines.push(`${kilometersFrequency} km sugeridos`);
    }
    return lines.join(" • ");
  }, [kilometersFrequency]);

  const resetForm = () => {
    setDate(new Date());
    setKilometers("");
    setDescription("");
  };

  const handleSubmit = async () => {
    const trimmedDescription = description.trim();
    const parsedKilometers = Number.parseFloat(
      kilometers.replace(/[^0-9.,]/g, "").replace(/,/g, ".")
    );

    if (!assignedMaintenanceId) {
      Alert.alert(
        "Mantenimiento no disponible",
        "No se puede registrar el mantenimiento porque falta el identificador."
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        "Sesión expirada",
        "No se pudo identificar al usuario actual. Inicia sesión nuevamente."
      );
      return;
    }

    if (!trimmedDescription || Number.isNaN(parsedKilometers)) {
      Alert.alert(
        "Datos incompletos",
        "Por favor completa todos los campos obligatorios."
      );
      return;
    }

    if (parsedKilometers <= 0) {
      Alert.alert(
        "Kilómetros inválidos",
        "Los kilómetros deben ser mayores a cero."
      );
      return;
    }

    const payload = {
      assignedMaintenanceId,
      userId,
      date,
      kilometers: parsedKilometers,
      notes: trimmedDescription,
    };

    try {
      setIsSubmitting(true);
      await createMaintenanceRecord(payload);
      resetForm();
      router.back();
    } catch (error) {
      console.error("Error al crear el mantenimiento", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el mantenimiento. Intenta nuevamente."
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
        <View style={styles.disabledInputs}>
          <Text style={styles.sectionTitle}>Mantenimiento seleccionado</Text>
          <TextInput
            value={maintenanceName || "Nombre no disponible"}
            editable={false}
            style={styles.disabledInput}
          />
          <TextInput
            value={maintenanceCategoryName || "Tipo no disponible"}
            editable={false}
            style={styles.disabledInput}
          />
          {maintenanceSummary ? (
            <Text style={styles.summaryText}>{maintenanceSummary}</Text>
          ) : null}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.sectionTitle}>Completa los datos</Text>
          <DatePicker
            label="Fecha"
            value={date}
            onChange={setDate}
            containerStyle={styles.datePicker}
          />
        </View>
        <TextInput
          placeholder="Kilómetros actuales"
          value={kilometers}
          onChangeText={setKilometers}
          style={styles.input}
          keyboardType="numeric"
          inputMode="numeric"
        />
        <TextInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.saveText}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 12,
  },
  disabledInputs: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#e9e9e9ff",
    borderRadius: 8,
    padding: 12,
    color: "#424242",
    fontWeight: "600",
  },
  formRow: {
    flexDirection: "column",
    justifyContent: "start",
    marginBottom: 16,
    backgroundColor: "#fff",
    gap: 10,
    padding: 16,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
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
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    fontSize: 16,
    color: "#424242",
  },
  multilineInput: {
    minHeight: 120,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#E53935",
  },
  saveButton: {
    backgroundColor: "#282D86",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#424242",
    fontStyle: "italic",
  },
});
