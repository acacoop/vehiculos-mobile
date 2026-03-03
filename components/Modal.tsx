import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "./Buttons";

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
  const inputRef = useRef<RNTextInput>(null);

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

  // Focus input when modal opens
  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

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
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[styles.content, { transform: [{ translateY }] }]}
          >
            <Text style={styles.title}>{title}</Text>
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#9CA0C5"
              style={[
                styles.textInput,
                !multiline && styles.textInputSingleLine,
              ]}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              textAlignVertical={multiline ? "top" : "center"}
              keyboardType={keyboardType}
              selection={{ start: value.length, end: value.length }}
            />
            <View style={styles.actions}>
              <Button text={cancelLabel} onPress={onCancel} variant="primary" />
              <Button
                text={confirmLabel}
                onPress={onConfirm}
                variant="primaryBg"
                disabled={confirmDisabled}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 1000,
  },
  keyboardAvoidingContainer: {
    flex: 1,
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
    justifyContent: "space-between",
  },
});

export default Modal;
