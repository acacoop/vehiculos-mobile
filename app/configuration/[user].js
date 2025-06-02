import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { FileUploader } from "../../components/FileUploader";
import { IconUser, IconArrowRigth } from "../../components/Icons";

export default function UserConfig() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("dni");
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [carnetFrente, setCarnetFrente] = useState(null);
  const [carnetDorso, setCarnetDorso] = useState(null);
  const [imageToView, setImageToView] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("dni");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración Usuario",
        }}
      />
      <View style={styles.pressable}>
        <View style={styles.avatar}>
          <IconUser size={24} color="white" />
        </View>
        <Text style={styles.text}>Nombre y Apellido</Text>
      </View>
      <View style={styles.pressable}>
        <Text style={styles.text}>ejemplocorreo@acacoop.com</Text>
      </View>
      <Pressable style={styles.pressable} onPress={() => openModal("dni")}>
        <Text style={styles.text}>DNI</Text>
        <IconArrowRigth size={24} color="white" />
      </Pressable>
      <Pressable style={styles.pressable} onPress={() => openModal("carnet")}>
        <Text style={styles.text}>Carnet de conducir</Text>
        <IconArrowRigth size={24} color="white" />
      </Pressable>

      {/* Modal para cargar/ver imágenes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "dni" ? "DNI" : "Carnet de Conducir"}
            </Text>
            <View style={{ gap: 20 }}>
              <View>
                <Text style={styles.modalSubtitle}>Frente</Text>
                <FileUploader
                  label={`Cargar frente ${modalType === "dni" ? "DNI" : "Carnet"}`}
                  onFileSelected={(file) => {
                    if (modalType === "dni") setDniFrente(file);
                    else setCarnetFrente(file);
                  }}
                />
                {((modalType === "dni" && dniFrente) ||
                  (modalType === "carnet" && carnetFrente)) && (
                  <TouchableOpacity
                    onPress={() =>
                      setImageToView(
                        modalType === "dni" ? dniFrente.uri : carnetFrente.uri
                      )
                    }
                  >
                    <Text style={styles.viewText}>Ver imagen frente</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text style={styles.modalSubtitle}>Dorso</Text>
                <FileUploader
                  label={`Cargar dorso ${modalType === "dni" ? "DNI" : "Carnet"}`}
                  onFileSelected={(file) => {
                    if (modalType === "dni") setDniDorso(file);
                    else setCarnetDorso(file);
                  }}
                />
                {((modalType === "dni" && dniDorso) ||
                  (modalType === "carnet" && carnetDorso)) && (
                  <TouchableOpacity
                    onPress={() =>
                      setImageToView(
                        modalType === "dni" ? dniDorso.uri : carnetDorso.uri
                      )
                    }
                  >
                    <Text style={styles.viewText}>Ver imagen dorso</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para visualizar imagen */}
      <Modal
        visible={!!imageToView}
        transparent
        animationType="fade"
        onRequestClose={() => setImageToView(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageModalContent}>
            <Image
              source={{ uri: imageToView }}
              style={{ width: 300, height: 200, borderRadius: 10 }}
              resizeMode="contain"
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setImageToView(null)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    color: "#282D86",
    fontWeight: "500",
    textAlign: "center",
  },
  pressable: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
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
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#282D86",
    marginBottom: 5,
    textAlign: "center",
  },
  viewText: {
    color: "#FE9000",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  closeButton: {
    backgroundColor: "#282D86",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  imageModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
});
