import React, { useState } from "react";
import { Platform, Modal, View, TouchableOpacity, Text } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
};

export const DatePicker = ({ value, onChange, label }: DatePickerProps) => {
  const [visible, setVisible] = useState(false);

  if (Platform.OS === "web") {
    return (
      <View
        style={{
          backgroundColor: "#eee",
          padding: 12,
          borderRadius: 8,
          width: "48%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
        <input
          type="date"
          value={value.toISOString().slice(0, 10)}
          onChange={(e) => {
            const newDate = new Date(value);
            const [year, month, day] = e.target.value.split("-");
            newDate.setFullYear(Number(year), Number(month) - 1, Number(day));
            onChange(newDate);
          }}
          style={{
            fontSize: 16,
            padding: 4,
            borderRadius: 4,
            border: "0px",
            backgroundColor: "transparent",
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
          }}
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
        style={{
          backgroundColor: "#eee",
          padding: 12,
          borderRadius: 8,
          width: "48%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => setVisible(true)}
      >
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
        <Text>{value.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {visible &&
        (Platform.OS === "ios" ? (
          <Modal transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#282D86",
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {picker}
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={{ alignSelf: "center", marginTop: 10 }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginBottom: 20,
                      fontSize: 20,
                    }}
                  >
                    Cerrar
                  </Text>
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
