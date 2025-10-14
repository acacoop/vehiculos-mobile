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

interface MaintenanceEntry {
  date: string;
  description: string;
}

interface MaintenanceButtonProps {
  onAddMaintenance: (entry: MaintenanceEntry) => void;
}

export default function MaintenanceButton({
  onAddMaintenance,
}: MaintenanceButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!description.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const newEntry: MaintenanceEntry = {
      date: date.toISOString(),
      description: description.trim(),
    };

    onAddMaintenance(newEntry);
    setModalVisible(false);
    setDate(new Date());
    setDescription("");
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
        onRequestClose={() => setModalVisible(false)}
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
              <Pressable onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
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
    padding: 10,
  },

  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
