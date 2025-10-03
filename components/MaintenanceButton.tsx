import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";

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
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!date || !description) {
      alert("Por favor completa todos los campos");
      return;
    }

    const newEntry: MaintenanceEntry = {
      date,
      description,
    };

    onAddMaintenance(newEntry);
    setModalVisible(false);
    setDate("");
    setDescription("");
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Mantenimiento</Text>
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

            <TextInput
              placeholder="Fecha"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#282D86",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.21)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
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
  input: {
    width: "100%",
    marginBottom: 12,
    padding: 20,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  cancelButton: {
    backgroundColor: "#E53935",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
