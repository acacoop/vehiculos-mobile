import {
  StyleSheet,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { colors } from "../constants/colors";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "primaryBg";

type ButtonProps = {
  text: string;
  icon?: (props: { pressed: boolean; color: string }) => React.JSX.Element;
  onPress: () => void | Promise<void>;
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  width?: string | number;
};

export function Button({
  text,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  loadingText,
  width = "90%",
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const displayText = isLoading && loadingText ? loadingText : text;

  const getBackgroundColor = (pressed: boolean) => {
    if (isDisabled) {
      return colors.disabled;
    }
    if (variant === "primary") {
      return pressed ? colors.white : colors.secondary;
    }
    if (variant === "primaryBg") {
      return pressed ? colors.white : colors.primary;
    }
    // variants "secondary" and "tertiary" use white background
    return pressed ? colors.backgroundLight : colors.white;
  };

  const getTextColor = (pressed: boolean) => {
    if (isDisabled) {
      return colors.textSecondary;
    }
    if (variant === "primary") {
      return pressed ? colors.secondary : colors.white;
    }
    if (variant === "primaryBg") {
      return pressed ? colors.primary : colors.white;
    }
    // variants "secondary" and "tertiary" use primary color
    return colors.primary;
  };

  const getJustifyContent = () => {
    // Variation 2 uses space-between when icon is present
    if (variant === "secondary" && icon) {
      return "space-between";
    }
    // When icon is present without secondary variant, align to start
    if (icon) {
      return "flex-start";
    }
    return "center";
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor(pressed), width: width as any },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {({ pressed }) => (
        <View style={[styles.content, { justifyContent: getJustifyContent() }]}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={
                variant === "primary" || variant === "primaryBg"
                  ? colors.white
                  : colors.primary
              }
            />
          )}
          <Text style={[styles.text, { color: getTextColor(pressed) }]}>
            {displayText}
          </Text>
          {icon &&
            !isLoading &&
            icon({ pressed, color: getTextColor(pressed) })}
        </View>
      )}
    </Pressable>
  );
}

// Legacy component for backward compatibility
export function PressableButton({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: (props: { pressed: boolean }) => React.JSX.Element;
  onPress: () => void | Promise<void>;
}) {
  return (
    <Button
      text={text}
      icon={({ pressed }) => icon({ pressed })}
      onPress={onPress}
      variant="primary"
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 10,
    shadowColor: "#00000070",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
});
