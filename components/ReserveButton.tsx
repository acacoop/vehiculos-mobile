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

export const ReserveButton = ({
  onReserve,
}: {
  onReserve(from: Date, to: Date): void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [fromTime, setFromTime] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());

  const [showPicker, setShowPicker] = useState<null | {
    mode: "date" | "time";
    type: "fromDate" | "fromTime" | "toDate" | "toTime";
  }>(null);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker(null);
      return;
    }

    switch (showPicker?.type) {
      case "fromDate":
        setFromDate(selectedDate);
        break;
      case "fromTime":
        setFromTime(selectedDate);
        break;
      case "toDate":
        setToDate(selectedDate);
        break;
      case "toTime":
        setToTime(selectedDate);
        break;
    }

    setShowPicker(null);
  };

  const renderPickerButton = (
    label: string,
    value: Date,
    mode: "date" | "time",
    type: "fromDate" | "fromTime" | "toDate" | "toTime"
  ) => (
    <TouchableOpacity
      style={styles.pickerContainer}
      onPress={() => {
        if (Platform.OS === "android") {
          setShowPicker({ mode, type });
        }
      }}
      disabled={Platform.OS === "ios"}
    >
      {Platform.OS === "android" && (
        <Text>
          {mode === "date"
            ? value.toLocaleDateString()
            : value.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
        </Text>
      )}
      {Platform.OS === "ios" && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={(_, date) => date && handleChange(_, date)}
          style={styles.picker}
          themeVariant="light"
        />
      )}
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    onReserve(mergeDateTime(fromDate, fromTime), mergeDateTime(toDate, toTime));
    setModalVisible(false);
  };

  const mergeDateTime = (date: Date, time: Date) => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.reserveText}>Reservar vehículo</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha desde</Text>
              <Text style={styles.label}>Hora desde</Text>
            </View>
            <View style={styles.row}>
              {renderPickerButton("Fecha desde", fromDate, "date", "fromDate")}
              {renderPickerButton("Hora desde", fromTime, "time", "fromTime")}
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha hasta</Text>
              <Text style={styles.label}>Hora hasta</Text>
            </View>
            <View style={styles.row}>
              {renderPickerButton("Fecha hasta", toDate, "date", "toDate")}
              {renderPickerButton("Hora hasta", toTime, "time", "toTime")}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirmar reserva</Text>
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

      {/* Android DateTimePicker*/}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={
            showPicker.type === "fromDate"
              ? fromDate
              : showPicker.type === "fromTime"
                ? fromTime
                : showPicker.type === "toDate"
                  ? toDate
                  : toTime
          }
          mode={showPicker.mode}
          display="default"
          onChange={handleChange}
        />
      )}
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
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    width: "50%",
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
    fontSize: 18,
  },
  picker: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 6,
  },
  pickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    width: "50%",
    padding: 10,
  },
});
