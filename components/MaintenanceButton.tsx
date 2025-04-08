import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from "react-native";

const MaintenanceButton = () => {
  type FormData = {
    field1: string;
    field2: string;
  };

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    field1: "",
    field2: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log("Form data saved:", formData);
    setShowForm(false);
  };

  return (
    <View style={styles.containerButtons}>
      <Pressable style={styles.Pressable} onPress={() => setShowForm(true)}>
        <Text style={styles.buttonText}>Actualización de mantenimiento</Text>
      </Pressable>

      <Modal
        visible={showForm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Actualizar Datos</Text>
            <TextInput
              style={styles.input}
              placeholder="Actualización de mantenimiento"
              value={formData.field1}
              onChangeText={(text) => handleInputChange("field1", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Actualización de mantenimiento"
              value={formData.field2}
              onChangeText={(text) => handleInputChange("field2", text)}
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerButtons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  Pressable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    width: 250,
  },
  buttonText: {
    color: "#282D86",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#282D86",
  },
  input: {
    width: "100%",
    borderColor: "#282D86",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#282D86",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    width: "100%",
  },
  cancelButtonText: {
    color: "#282D86",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MaintenanceButton;
