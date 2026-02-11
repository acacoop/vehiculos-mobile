import { StyleSheet, View, Pressable, Text } from "react-native";
import { colors } from "../constants/colors";

type BottomActionButtonProps = {
  text: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

export function BottomActionButton({
  text,
  onPress,
  disabled = false,
  isLoading = false,
  loadingText,
}: BottomActionButtonProps) {
  const isDisabled = disabled || isLoading;
  const displayText = isLoading && loadingText ? loadingText : text;

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>{displayText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    zIndex: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
