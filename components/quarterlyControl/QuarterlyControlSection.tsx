import React, { useMemo } from "react";
import { StyleSheet, Pressable, Text, View, Animated } from "react-native";
import {
  QuarterlyControlCategory,
  QuarterlyControlChoice,
  QuarterlyControlItemUI,
} from "../../interfaces/quarterlyControls";
import { Icon, getIconByKey } from "../Icons";
import { useSectionAnimation } from "./useSectionAnimation";
import { colors } from "../../constants/colors";

export type QuarterlyControlSectionProps = {
  category: QuarterlyControlCategory;
  isExpanded: boolean;
  answers: Record<string, QuarterlyControlChoice>;
  onToggle: (categoryId: string) => void;
  onChoice: (itemId: string, choice: QuarterlyControlChoice) => void;
  onOpenObservation: (itemId: string) => void;
  observations: Record<string, string>;
};

export function QuarterlyControlSection({
  category,
  isExpanded,
  answers,
  onToggle,
  onChoice,
  onOpenObservation,
  observations,
}: QuarterlyControlSectionProps) {
  const { renderBody, bodyAnimationStyle, arrowAnimationStyle } =
    useSectionAnimation(isExpanded);

  const IconComponent = useMemo(
    () => getIconByKey(category.iconKey ?? "shield"),
    [category.iconKey],
  );

  // Check section status: pending, completed (all yes), or hasErrors (at least one no)
  const sectionStatus = useMemo(() => {
    if (!category.items.length) return "pending";

    const allAnswered = category.items.every((item) => {
      const answer = answers?.[item.id];
      return answer === "yes" || answer === "no";
    });

    const hasErrors = category.items.some(
      (item) => answers?.[item.id] === "no",
    );

    if (!allAnswered) return "pending";
    if (hasErrors) return "error";
    return "success";
  }, [category.items, answers]);

  const iconBadgeStyle = useMemo(() => {
    switch (sectionStatus) {
      case "success":
        return styles.iconBadgeSuccess;
      case "error":
        return styles.iconBadgeError;
      default:
        return null;
    }
  }, [sectionStatus]);

  const iconColor = useMemo(() => {
    switch (sectionStatus) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      default:
        return colors.primary;
    }
  }, [sectionStatus]);

  return (
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [
          styles.sectionHeader,
          pressed && styles.sectionHeaderPressed,
        ]}
        onPress={() => onToggle(category.id)}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconBadge, iconBadgeStyle]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <Text style={styles.sectionTitle}>{category.title}</Text>
        </View>
        <Animated.View style={arrowAnimationStyle}>
          <Icon name="down" size={18} color="#282D86" />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[
          styles.sectionBodyWrapper,
          bodyAnimationStyle,
          !renderBody && styles.sectionBodyHidden,
        ]}
        pointerEvents={isExpanded ? "auto" : "none"}
      >
        {renderBody && (
          <View style={styles.sectionBody}>
            {category.items.map((item: QuarterlyControlItemUI) => {
              const answer = answers?.[item.id] ?? null;
              const hasObservation = !!observations?.[item.id]?.trim();
              return (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemLabelContainer}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.choiceGroup}>
                    <Pressable
                      onPress={() => onChoice(item.id, "yes")}
                      style={({ pressed }) => [
                        styles.choiceCircle,
                        answer === "yes" && styles.choiceCircleActive,
                        pressed && styles.choiceCirclePressed,
                      ]}
                    >
                      <Icon
                        name="check"
                        size={14}
                        color={answer === "yes" ? "#ffffff" : "#D0D4EB"}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        onChoice(item.id, "no");
                        // Solo abrir modal si no estaba ya seleccionado "no"
                        if (answer !== "no") {
                          onOpenObservation(item.id);
                        }
                      }}
                      style={({ pressed }) => [
                        styles.choiceCircle,
                        answer === "no" && styles.choiceCircleInactive,
                        pressed && styles.choiceCirclePressed,
                      ]}
                    >
                      <Icon
                        name="close"
                        size={14}
                        color={answer === "no" ? "#ffffff" : "#D0D4EB"}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => onOpenObservation(item.id)}
                      style={({ pressed }) => [
                        styles.choiceCircle,
                        hasObservation && styles.choiceCircleObservation,
                        pressed && styles.choiceCirclePressed,
                      ]}
                    >
                      <Icon
                        name="information"
                        size={14}
                        color={hasObservation ? "#ffffff" : "#D0D4EB"}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sectionHeaderPressed: {
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
    backgroundColor: "#EEF1FE",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeSuccess: {
    backgroundColor: "#E8F5E9",
  },
  iconBadgeError: {
    backgroundColor: "#FFEBEE",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#282D86",
  },
  sectionBodyWrapper: {
    overflow: "hidden",
  },
  sectionBodyHidden: {
    height: 0,
    opacity: 0,
    paddingVertical: 0,
  },
  sectionBody: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 18,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    color: "#4A4A68",
  },
  itemLabelContainer: {
    flex: 1,
    gap: 6,
  },
  choiceGroup: {
    flexDirection: "row",
    gap: 12,
  },
  choiceCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D0D4EB",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceCircleActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  choiceCircleInactive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  choiceCircleObservation: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceCirclePressed: {
    opacity: 0.8,
  },
  observationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
