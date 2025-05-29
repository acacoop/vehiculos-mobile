import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";

type FileUploaderProps = {
  label: string;
  onFileSelected?: (file: DocumentPicker.DocumentPickerAsset) => void;
};

export const FileUploader = ({ label, onFileSelected }: FileUploaderProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileName(file.name);
        onFileSelected && onFileSelected(file);
      }
    } catch (err) {
      console.error("Error al seleccionar archivo:", err);
    }
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <Pressable
        style={{
          backgroundColor: "#282D86",
          padding: 15,
          borderRadius: 10,
          width: 200,
          alignItems: "center",
        }}
        onPress={pickFile}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {label}
        </Text>
      </Pressable>
      {fileName && (
        <Text style={{ marginTop: 10, color: "#282D86" }}>{fileName}</Text>
      )}
    </View>
  );
};
