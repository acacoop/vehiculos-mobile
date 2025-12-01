import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

export type ModalProps = {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
  confirmDisabled?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  value,
  onChangeText,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  placeholder = "Agrega una observación",
  confirmDisabled = false,
  keyboardType = "default",
  multiline = true,
}) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 24,
          duration: 160,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropOpacity, translateY, visible]);

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Animated.View
          style={[styles.content, { transform: [{ translateY }] }]}
        >
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA0C5"
            style={[styles.textInput, !multiline && styles.textInputSingleLine]}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? "top" : "center"}
            keyboardType={keyboardType}
          />
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonLabel, styles.cancelLabel]}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.confirmButton,
                confirmDisabled && styles.buttonDisabled,
              ]}
              onPress={onConfirm}
              disabled={confirmDisabled}
            >
              <Text style={[styles.buttonLabel, styles.confirmLabel]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 24,
    gap: 16,
    shadowColor: "#00000040",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#282D86",
  },
  textInput: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D4EB",
    padding: 14,
    fontSize: 16,
    color: "#424242",
    backgroundColor: "#F8F9FF",
  },
  textInputSingleLine: {
    minHeight: 50,
    textAlign: "center",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#FE9000",
  },
  cancelLabel: {
    color: "#FFFF",
  },
  confirmButton: {
    backgroundColor: "#282D86",
  },
  confirmLabel: {
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default Modal;
