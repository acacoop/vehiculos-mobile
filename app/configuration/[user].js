import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text, Pressable, Modal, Image } from "react-native";
import { DniModal } from "../../components/DniModal";
import { IconUser, IconArrowRigth } from "../../components/Icons";
import { getCurrentUser } from "../../services/me";

export default function UserConfig() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("dni");
  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);
  const [carnetFrente, setCarnetFrente] = useState(null);
  const [carnetDorso, setCarnetDorso] = useState(null);
  const [imageToView, setImageToView] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("dni");
  };

  function removeImage(side, tipo) {
    if (tipo === "dni") {
      if (side === "frente") setDniFrente(null);
      else setDniDorso(null);
    } else {
      if (side === "frente") setCarnetFrente(null);
      else setCarnetDorso(null);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
        setUserInfo(currentUser);
        setUserError(null);
      } catch (error) {
        console.error("No se pudo obtener la información del usuario", error);
        if (isMounted) {
          setUserInfo(null);
          setUserError("No se pudo cargar tu información");
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const userFullName = useMemo(() => {
    if (!userInfo) return "";
    const fullName = `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`
      .trim()
      .replace(/\s+/g, " ");
    return fullName || userInfo.email || "";
  }, [userInfo]);

  const userEmail = userInfo?.email ?? "";

  const renderUserName = () => {
    if (loadingUser) return "Cargando nombre...";
    if (userError) return userError;
    return userFullName || "Nombre no disponible";
  };

  const renderUserEmail = () => {
    if (loadingUser) return "Cargando correo...";
    if (userError) return "Correo no disponible";
    return userEmail || "Correo no disponible";
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Configuración Usuario",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.pressable}>
        <View style={styles.avatar}>
          <IconUser size={20} />
        </View>
        <Text style={styles.text}>{renderUserName()}</Text>
      </View>
      <View style={styles.pressable}>
        <Text style={styles.text}>{renderUserEmail()}</Text>
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalType("dni");
          setModalVisible("dni");
        }}
      >
        <Text style={styles.text}>DNI</Text> <IconArrowRigth size={20} />
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          setModalType("carnet");
          setModalVisible("carnet");
        }}
      >
        <Text style={styles.text}>Carnet de conducir</Text>{" "}
        <IconArrowRigth size={20} />
      </Pressable>

      {/* Modal para DNI */}
      <DniModal
        visible={modalVisible === "dni"}
        onClose={closeModal}
        type="dni"
        frente={dniFrente}
        dorso={dniDorso}
        setFrente={setDniFrente}
        setDorso={setDniDorso}
        removeImage={(side) => removeImage(side, "dni")}
        setImageToView={setImageToView}
      />
      {/* Modal para Carnet */}
      <DniModal
        visible={modalVisible === "carnet"}
        onClose={closeModal}
        type="carnet"
        frente={carnetFrente}
        dorso={carnetDorso}
        setFrente={setCarnetFrente}
        setDorso={setCarnetDorso}
        removeImage={(side) => removeImage(side, "carnet")}
        setImageToView={setImageToView}
      />
      {/* Modal para ver imagen */}
      <Modal
        visible={!!imageToView}
        transparent
        animationType="fade"
        onRequestClose={() => setImageToView(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageModalContent}>
            {imageToView ? (
              <Image
                source={{ uri: imageToView }}
                style={{ width: 300, height: 200, borderRadius: 10 }}
                resizeMode="contain"
                onError={(e) => {
                  console.warn(
                    "No se pudo cargar la imagen:",
                    imageToView,
                    e.nativeEvent
                  );
                }}
              />
            ) : (
              <Text style={{ color: "red", marginBottom: 10 }}>
                No se pudo cargar la imagen.
              </Text>
            )}
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
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#00000077",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    borderColor: "#ddd",
    borderWidth: 1,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#E53935",
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
