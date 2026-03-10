import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { colors } from "../constants/colors";

type ReserveModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
};

export const ReserveModal = ({
  visible,
  onClose,
  onConfirm,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  confirmDisabled,
  confirmLoading,
}: ReserveModalProps) => {
  // Si cambia desde y es mayor que hasta, iguala hasta a desde
  const handleFromChange = (date: Date) => {
    setFromDate(date);
    if (date > toDate) setToDate(date);
  };
  // Si cambia hasta y es menor que desde, iguala desde a hasta
  const handleToChange = (date: Date) => {
    setToDate(date);
    if (date < fromDate) setFromDate(date);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.sectionTitle}>Seleccioná fecha y hora</Text>
          <View style={styles.row}>
            <DatePicker
              label="Desde fecha"
              value={fromDate}
              onChange={handleFromChange}
            />
            <TimePicker
              label="Desde hora"
              value={fromDate}
              onChange={handleFromChange}
            />
          </View>
          <View style={styles.row}>
            <DatePicker
              label="Hasta fecha"
              value={toDate}
              onChange={handleToChange}
            />
            <TimePicker
              label="Hasta hora"
              value={toDate}
              onChange={handleToChange}
            />
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (confirmDisabled || confirmLoading) && { opacity: 0.7 },
              ]}
              onPress={onConfirm}
              disabled={confirmDisabled || confirmLoading}
            >
              <Text style={styles.buttonText}>
                {confirmLoading ? "Confirmar" : "Confirmar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    width: "90%",
    borderRadius: 12,
    elevation: 5,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  pickerButton: {
    flex: 1,
    backgroundColor: colors.gray[200],
    padding: 12,
    borderRadius: 8,
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
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
