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
import { colors } from "../constants/colors";

type DatePickerProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export const DatePicker = ({
  value,
  onChange,
  label,
  containerStyle,
  children,
}: DatePickerProps) => {
  const [visible, setVisible] = useState(false);

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          children ? styles.childrenContainer : null,
        ]}
      >
        {children ? (
          <View style={{ width: "100%", position: "relative" }}>
            {children}
            <input
              type="date"
              value={value.toISOString().slice(0, 10)}
              onChange={(e) => {
                const newDate = new Date(value);
                const [year, month, day] = e.target.value.split("-");
                newDate.setFullYear(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
                );
                onChange(newDate);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                zIndex: 10,
              }}
            />
          </View>
        ) : (
          <>
            <Text style={styles.label}>{label}</Text>
            <input
              type="date"
              value={value.toISOString().slice(0, 10)}
              onChange={(e) => {
                const newDate = new Date(value);
                const [year, month, day] = e.target.value.split("-");
                newDate.setFullYear(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
                );
                onChange(newDate);
              }}
              style={webInputStyle}
            />
          </>
        )}
      </View>
    );
  }

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        value.getMilliseconds(),
      );
      onChange(newDate);
    }
  };

  const picker = (
    <DateTimePicker
      value={value}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
      themeVariant="light"
    />
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          containerStyle,
          children ? styles.childrenContainer : null,
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        {children ? (
          children
        ) : (
          <>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value.toLocaleDateString()}</Text>
          </>
        )}
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
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderExtraLight,
  },
  childrenContainer: {
    backgroundColor: "transparent",
    padding: 0,
    width: "100%",
    borderRadius: 0,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.primary,
  },
  value: {
    fontSize: 16,
    color: colors.textDarkAlt,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
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
    color: colors.primary,
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
