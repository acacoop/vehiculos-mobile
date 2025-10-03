import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { FileUploader } from "./FileUploader";
import { IconClose } from "./Icons";

export interface DniImage {
  uri: string;
}

export interface DniModalProps {
  visible: boolean;
  onClose: () => void;
  type: "dni" | "carnet";
  frente: DniImage | null;
  dorso: DniImage | null;
  setFrente: (img: DniImage | null) => void;
  setDorso: (img: DniImage | null) => void;
  removeImage: (side: "frente" | "dorso") => void;
  setImageToView: (uri: string) => void;
}

export const DniModal: React.FC<DniModalProps> = ({
  visible,
  onClose,
  type,
  frente,
  dorso,
  setFrente,
  setDorso,
  removeImage,
  setImageToView,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {type === "dni" ? "DNI" : "Carnet de Conducir"}
        </Text>
        <View style={styles.sectionGap}>
          {/* Frente */}
          <View style={{ alignItems: "center" }}>
            {!frente && (
              <FileUploader
                label={`Cargar frente ${type === "dni" ? "DNI" : "Carnet"}`}
                onFileSelected={setFrente}
                reset={!frente}
              />
            )}
            {frente && (
              <View style={styles.imageWrapper}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => removeImage("frente")}
                >
                  <IconClose size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageTouchable}
                  onPress={() => setImageToView(frente.uri)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: frente.uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* Dorso */}
          <View style={{ alignItems: "center" }}>
            {!dorso && (
              <FileUploader
                label={`Cargar dorso ${type === "dni" ? "DNI" : "Carnet"}`}
                onFileSelected={setDorso}
                reset={!dorso}
              />
            )}
            {dorso && (
              <View style={styles.imageWrapper}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => removeImage("dorso")}
                >
                  <IconClose size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageTouchable}
                  onPress={() => setImageToView(dorso.uri)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: dorso.uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    width: 340,
    alignItems: "center",
    gap: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 10,
  },
  sectionGap: {
    gap: 20,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 70,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    position: "absolute",
    top: -16,
    right: -16,
    zIndex: 2,
    backgroundColor: "#E53935",
    borderRadius: 16,
    padding: 2,
  },
  imageTouchable: {
    width: 100,
    height: 70,
  },
  image: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
});
