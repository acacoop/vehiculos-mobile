import React, { useMemo } from "react";
import { StyleSheet, Pressable, Text, View, Animated } from "react-native";
import {
  ChecklistCategory,
  ChecklistChoice,
  ChecklistItem,
} from "../../interfaces/checklists";
import { Icon, getIconByKey } from "../Icons";
import { useSectionAnimation } from "./useSectionAnimation";

export type ChecklistSectionProps = {
  category: ChecklistCategory;
  isExpanded: boolean;
  answers: Record<string, ChecklistChoice>;
  onToggle: (categoryId: string) => void;
  onChoice: (itemId: string, choice: ChecklistChoice) => void;
  onOpenObservation: (itemId: string) => void;
  observations: Record<string, string>;
};

export function ChecklistSection({
  category,
  isExpanded,
  answers,
  onToggle,
  onChoice,
  onOpenObservation,
}: ChecklistSectionProps) {
  const { renderBody, bodyAnimationStyle, arrowAnimationStyle } =
    useSectionAnimation(isExpanded);

  const IconComponent = useMemo(
    () => getIconByKey(category.iconKey ?? "shield"),
    [category.iconKey]
  );

  // Check if all items in this category have been answered
  const isCompleted = useMemo(() => {
    if (!category.items.length) return false;
    return category.items.every((item) => {
      const answer = answers?.[item.id];
      return answer === "yes" || answer === "no";
    });
  }, [category.items, answers]);

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
          <View
            style={[styles.iconBadge, isCompleted && styles.iconBadgeCompleted]}
          >
            {isCompleted ? (
              <Icon name="check" size={20} color="#FFFFFF" />
            ) : (
              <IconComponent size={20} color="#282D86" />
            )}
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
            {category.items.map((item: ChecklistItem) => {
              const answer = answers?.[item.id] ?? null;
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
                      {answer === "yes" && (
                        <Icon name="check" size={14} color="#ffffff" />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => onOpenObservation(item.id)}
                      style={({ pressed }) => [
                        styles.choiceCircle,
                        answer === "no" && styles.choiceCircleInactive,
                        pressed && styles.choiceCirclePressed,
                      ]}
                    >
                      {answer === "no" && (
                        <Icon name="close" size={14} color="#ffffff" />
                      )}
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
  iconBadgeCompleted: {
    backgroundColor: "#282D86",
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
    backgroundColor: "#FE9000",
    borderColor: "#FE9000",
  },
  choiceCircleInactive: {
    backgroundColor: "#282D86",
    borderColor: "#282D86",
  },
  choiceCirclePressed: {
    opacity: 0.8,
  },
});
