import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export const ReserveButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [fromTime, setFromTime] = useState<Date | null>(null);
  const [toTime, setToTime] = useState<Date | null>(null);

  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [pickerTarget, setPickerTarget] = useState<
    "fromDate" | "toDate" | "fromTime" | "toTime" | null
  >(null);
  const [showPicker, setShowPicker] = useState(false);

  const openPicker = (
    target: "fromDate" | "toDate" | "fromTime" | "toTime",
    mode: "date" | "time"
  ) => {
    setPickerTarget(target);
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onChange = (_: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      switch (pickerTarget) {
        case "fromDate":
          setFromDate(selectedDate);
          break;
        case "toDate":
          setToDate(selectedDate);
          break;
        case "fromTime":
          setFromTime(selectedDate);
          break;
        case "toTime":
          setToTime(selectedDate);
          break;
      }
    }
    setShowPicker(false);
  };

  const handleConfirm = () => {
    if (fromDate && toDate && fromTime && toTime) {
      alert(
        `Reservado desde: ${fromDate.toLocaleDateString()} ${fromTime.toLocaleTimeString()} hasta ${toDate.toLocaleDateString()} ${toTime.toLocaleTimeString()}`
      );
      setModalVisible(false);
    } else {
      alert("Faltan datos de la reserva.");
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString() : "Seleccionar fecha";

  const formatTime = (time: Date | null) =>
    time
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Seleccionar hora";

  return (
    <View style={styles.container}>
      {/* BOTÓN PRINCIPAL */}
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.reserveText}>Reservar vehículo</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Fecha desde</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openPicker("fromDate", "date")}
            >
              <Text>{formatDate(fromDate)}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Hora desde</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openPicker("fromTime", "time")}
            >
              <Text>{formatTime(fromTime)}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Fecha hasta</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openPicker("toDate", "date")}
            >
              <Text>{formatDate(toDate)}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Hora hasta</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openPicker("toTime", "time")}
            >
              <Text>{formatTime(toTime)}</Text>
            </TouchableOpacity>

            {showPicker && pickerMode && (
              <DateTimePicker
                value={new Date()}
                mode={pickerMode}
                display="default"
                onChange={onChange}
              />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirmar reserva</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  reserveButton: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
  },
  reserveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 12,
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#282D86",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
