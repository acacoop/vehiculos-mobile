import React, { useState } from "react";
import {
  Platform,
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type DatePickerProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const DatePicker = ({
  value,
  onChange,
  label,
  containerStyle,
}: DatePickerProps) => {
  const [visible, setVisible] = useState(false);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.label}>{label}</Text>
        <input
          type="date"
          value={value.toISOString().slice(0, 10)}
          onChange={(e) => {
            const newDate = new Date(value);
            const [year, month, day] = e.target.value.split("-");
            newDate.setFullYear(Number(year), Number(month) - 1, Number(day));
            onChange(newDate);
          }}
          style={webInputStyle}
        />
      </View>
    );
  }

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) onChange(selectedDate);
  };

  const picker = (
    <DateTimePicker
      value={value}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
    />
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {visible &&
        (Platform.OS === "ios" ? (
          <Modal transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {picker}
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          picker
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#282D86",
  },
  value: {
    fontSize: 16,
    color: "#424242",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#282D86",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 20,
  },
});

const webInputStyle: React.CSSProperties = {
  fontSize: 16,
  padding: 4,
  borderRadius: 4,
  border: "0px",
  backgroundColor: "transparent",
  outline: "none",
  boxShadow: "none",
  WebkitAppearance: "none",
  textAlign: "center",
};
