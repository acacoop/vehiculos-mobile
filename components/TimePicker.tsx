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

type TimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export const TimePicker = ({
  value,
  onChange,
  label,
  containerStyle,
  children,
}: TimePickerProps) => {
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
          <View style={styles.childrenWrapper}>
            {children}
            <input
              type="time"
              value={value.toTimeString().slice(0, 5)}
              onChange={(e) => {
                const [hour, minute] = e.target.value.split(":");
                const newDate = new Date(value);
                newDate.setHours(Number(hour), Number(minute));
                onChange(newDate);
              }}
              style={webInputStyle}
            />
          </View>
        ) : (
          <>
            <Text style={styles.label}>{label}</Text>
            <input
              type="time"
              value={value.toTimeString().slice(0, 5)}
              onChange={(e) => {
                const [hour, minute] = e.target.value.split(":");
                const newDate = new Date(value);
                newDate.setHours(Number(hour), Number(minute));
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
      const newDate = new Date(value);
      newDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        selectedDate.getSeconds(),
        selectedDate.getMilliseconds()
      );
      onChange(newDate);
    }
  };

  const picker = (
    <DateTimePicker
      value={value}
      mode="time"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
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
            <Text style={styles.value}>
              {value.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
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
    backgroundColor: "#ffff",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  childrenContainer: {
    backgroundColor: "transparent",
    padding: 0,
    width: "100%",
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderColor: "transparent",
    borderWidth: 0,
  },
  childrenWrapper: {
    width: "100%",
    position: "relative",
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
