import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
  UIManager,
} from "react-native";
import { Icon } from "./Icons";

// Habilitar LayoutAnimation en Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type DropdownProps = {
  /** Título que se muestra en el header del dropdown */
  title: string;
  /** Si el dropdown está inicialmente abierto */
  defaultOpen?: boolean;
  /** Contenido que se muestra cuando está expandido */
  children: React.ReactNode;
  /** Icono personalizado para el header (opcional) */
  icon?: string;
  /** Color del icono */
  iconColor?: string;
  /** Color de fondo del badge del icono */
  iconBackgroundColor?: string;
};

export function Dropdown({
  title,
  defaultOpen = false,
  children,
  icon = "tool",
  iconColor = "#282D86",
  iconBackgroundColor = "#EEF1FE",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [shouldRender, setShouldRender] = useState(defaultOpen);
  const animation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [isOpen, animation]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const bodyAnimationStyle = useMemo(
    () => ({
      opacity: animation,
      transform: [
        {
          scaleY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.96, 1],
          }),
        },
      ],
    }),
    [animation]
  );

  const arrowAnimationStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          }),
        },
      ],
    }),
    [animation]
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
        onPress={toggleDropdown}
      >
        <View style={styles.headerLeft}>
          <View
            style={[styles.iconBadge, { backgroundColor: iconBackgroundColor }]}
          >
            <Icon name={icon} size={20} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Animated.View style={arrowAnimationStyle}>
          <Icon name="down" size={18} color="#282D86" />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.contentWrapper,
          bodyAnimationStyle,
          !shouldRender && styles.contentHidden,
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        {shouldRender && <View style={styles.content}>{children}</View>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#00000022",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerPressed: {
    backgroundColor: "#F6F7FF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#282D86",
  },
  contentWrapper: {
    overflow: "hidden",
  },
  contentHidden: {
    height: 0,
    opacity: 0,
    paddingVertical: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
});
