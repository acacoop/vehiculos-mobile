import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { Button } from "./Buttons";

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
  return (
    <View style={styles.container}>
      <Button
        text={text}
        onPress={onPress}
        disabled={disabled}
        isLoading={isLoading}
        loadingText={loadingText}
        variant="primary"
        width="90%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    zIndex: 10,
    alignItems: "center",
    minHeight: 120,
  },
});
