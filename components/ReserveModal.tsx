import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";

type ReserveModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
};

export const ReserveModal = ({
  visible,
  onClose,
  onConfirm,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: ReserveModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.sectionTitle}>Seleccioná fecha y hora</Text>
        <View style={styles.row}>
          <DatePicker
            label="Desde Fecha"
            value={fromDate}
            onChange={setFromDate}
          />
          <TimePicker
            label="Desde Hora"
            value={fromDate}
            onChange={setFromDate}
          />
        </View>
        <View style={styles.row}>
          <DatePicker
            label="Hasta Fecha"
            value={toDate}
            onChange={setToDate}
          />
          <TimePicker
            label="Hasta Hora"
            value={toDate}
            onChange={setToDate}
          />
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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
    justifyContent: "center",
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