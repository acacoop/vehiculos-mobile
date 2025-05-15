import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type PickerMode = "fromDate" | "fromTime" | "toDate" | "toTime" | null;

export const ReserveButton = ({
  onReserve,
}: {
  onReserve: (reservation: { from: string; to: string }) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [showPicker, setShowPicker] = useState(false);

  const openPicker = (mode: PickerMode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker(false);
      return;
    }

    setShowPicker(Platform.OS === "ios");

    switch (pickerMode) {
      case "fromDate": {
        const updated = new Date(fromDate);
        updated.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        setFromDate(updated);
        break;
      }
      case "fromTime": {
        const updated = new Date(fromDate);
        updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        setFromDate(updated);
        break;
      }
      case "toDate": {
        const updated = new Date(toDate);
        updated.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        setToDate(updated);
        break;
      }
      case "toTime": {
        const updated = new Date(toDate);
        updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        setToDate(updated);
        break;
      }
    }
  };

  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  const handleConfirm = () => {
    if (toDate < fromDate) {
      alert("La fecha y hora final debe ser posterior a la inicial.");
      return;
    }

    onReserve({
      from: normalizeDate(fromDate),
      to: normalizeDate(toDate),
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.reserveText}>Reservar vehículo</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Seleccioná fecha y hora</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("fromDate")}
              >
                <Text>Desde Fecha: {fromDate.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("fromTime")}
              >
                <Text>
                  Desde Hora:{" "}
                  {fromDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("toDate")}
              >
                <Text>Hasta Fecha: {toDate.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("toTime")}
              >
                <Text>
                  Hasta Hora:{" "}
                  {toDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {showPicker && pickerMode && (
              <DateTimePicker
                value={pickerMode.includes("from") ? fromDate : toDate}
                mode={pickerMode.includes("Date") ? "date" : "time"}
                display="default"
                onChange={onChange}
              />
            )}

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
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
  container: { padding: 20 },
  reserveButton: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
  },
  reserveText: {
    color: "#fff",
    fontSize: 20,
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
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  pickerButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#282D86",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
