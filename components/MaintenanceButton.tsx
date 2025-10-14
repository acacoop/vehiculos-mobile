import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { DatePicker } from "./DatePicker";
import {
  createMaintenanceRecord,
  CreateMaintenanceRecordInput,
} from "../services/maintenanceRecords";
import { MaintenanceRecord } from "../interfaces/maintenanceRecord";

interface MaintenanceButtonProps {
  assignedMaintenanceId: string | undefined;
  userId: string | null;
  onAddMaintenance: (entry: MaintenanceRecord) => void;
}

export default function MaintenanceButton({
  assignedMaintenanceId,
  userId,
  onAddMaintenance,
}: MaintenanceButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setDate(new Date());
    setDescription("");
    setKilometers("");
  };

  const handleSave = async () => {
    const trimmedDescription = description.trim();
    const parsedKilometers = Number.parseFloat(
      kilometers.replace(/[^0-9.,]/g, "").replace(/,/g, ".")
    );

    if (!assignedMaintenanceId) {
      alert("No se puede registrar el mantenimiento: falta el identificador.");
      return;
    }

    if (!userId) {
      alert(
        "No se pudo identificar al usuario actual. Inicia sesión nuevamente."
      );
      return;
    }

    if (!trimmedDescription || Number.isNaN(parsedKilometers)) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (parsedKilometers <= 0) {
      alert("Los kilómetros deben ser mayores a cero");
      return;
    }

    const payload: CreateMaintenanceRecordInput = {
      assignedMaintenanceId,
      userId,
      date,
      kilometers: parsedKilometers,
      notes: trimmedDescription,
    };

    try {
      setIsSubmitting(true);
      const record = await createMaintenanceRecord(payload);
      onAddMaintenance(record);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear el mantenimiento", error);
      alert("No se pudo guardar el mantenimiento. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>+ Agregar Mantenimiento</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nuevo Mantenimiento</Text>
            <DatePicker
              label="Fecha"
              value={date}
              onChange={setDate}
              containerStyle={styles.datePicker}
            />
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
              style={styles.input}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Pressable
                onPress={handleSave}
                style={[styles.saveButton, isSubmitting && { opacity: 0.6 }]}
                disabled={isSubmitting}
              >
                <Text style={styles.saveButtonText}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.21)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
    color: "#282D86",
  },
  datePicker: {
    width: "100%",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#282D86",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    width: "50%",
    paddingVertical: 14,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  cancelButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    width: "50%",
    paddingVertical: 14,
  },

  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
