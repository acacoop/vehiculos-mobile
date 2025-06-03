import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";

type FileUploaderProps = {
  label: string;
  onFileSelected?: (file: DocumentPicker.DocumentPickerAsset) => void;
};

export const FileUploader = ({ label, onFileSelected }: FileUploaderProps) => {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile(pickedFile);
        onFileSelected && onFileSelected(pickedFile);
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
      {/* Espacio reservado para la miniatura o nombre */}
      <View
        style={{
          height: 70,
          width: 100,
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: file ? 1 : 0,
          borderColor: "#ccc",
          borderRadius: 8,
          backgroundColor: "#f5f5f5",
        }}
      >
        {file && file.uri && file.mimeType?.startsWith("image/") ? (
          <Image
            source={{ uri: file.uri }}
            style={{ width: 100, height: 70, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : file ? (
          <Text style={{ color: "#282D86", textAlign: "center" }}>
            {file.name}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
