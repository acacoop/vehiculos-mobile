import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
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
    paddingTop: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    zIndex: 10,
    alignItems: "center",
  },
});
