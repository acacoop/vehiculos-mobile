import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

type PickedImage = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
};

type FileUploaderProps = {
  label: string;
  onFileSelected?: (file: PickedImage) => void;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center" as const,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#282D86",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center" as const,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold" as const,
    fontSize: 16,
  },
  thumbnailContainer: {
    height: 70,
    width: 100,
    marginTop: 10,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  thumbnailContainerEmpty: {
    borderWidth: 0,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
});

export const FileUploader = ({
  label,
  onFileSelected,
  reset,
}: FileUploaderProps & { reset?: boolean }) => {
  const [file, setFile] = useState<any>(null);

  // Resetear el estado interno cuando la prop reset cambia a true
  React.useEffect(() => {
    if (reset) setFile(null);
  }, [reset]);

  // Resetear el estado interno cuando el componente se desmonte
  useEffect(() => {
    return () => setFile(null);
  }, []);

  const pickFile = async () => {
    try {
      // Solicitar permisos si es necesario
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Se necesita acceso a la galería de imágenes."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        setFile(picked);
        // Adaptar a la API esperada por onFileSelected
        onFileSelected &&
          onFileSelected({
            uri: picked.uri,
            name: picked.fileName || picked.uri.split("/").pop() || "image.jpg",
            mimeType: picked.type ? `image/${picked.type}` : "image/jpeg",
            size: picked.fileSize,
          });
      }
    } catch (err) {
      console.error("Error al seleccionar imagen:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
      {/* Espacio reservado para la miniatura o nombre */}
      <View
        style={
          file && file.uri
            ? styles.thumbnailContainer
            : [styles.thumbnailContainer, styles.thumbnailContainerEmpty]
        }
      >
        {file && file.uri ? (
          <Image
            source={{ uri: file.uri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : null}
      </View>
    </View>
  );
};
