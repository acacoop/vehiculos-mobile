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
        animationType="slide"
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

            <Button title="Guardar" onPress={handleSave} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});
