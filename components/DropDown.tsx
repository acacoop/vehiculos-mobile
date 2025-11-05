import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  ChecklistCategory,
  ChecklistChoice,
  ChecklistState,
} from "../interfaces/checklists/types";
import { Icon, getIconByKey } from "./Icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type DropDownProps = {
  categories: ChecklistCategory[];
  value?: ChecklistState;
  onChange?: (next: ChecklistState) => void;
  defaultExpanded?: string[];
  autoAdvance?: boolean;
};

const buildInitialState = (categories: ChecklistCategory[]): ChecklistState => {
  return categories.reduce<ChecklistState>((acc, category) => {
    acc[category.id] = category.items.reduce<Record<string, ChecklistChoice>>(
      (itemAcc, item) => {
        itemAcc[item.id] = null;
        return itemAcc;
      },
      {},
    );
    return acc;
  }, {});
};

type SectionProps = {
  category: ChecklistCategory;
  isExpanded: boolean;
  answers: Record<string, ChecklistChoice>;
  onToggle: (categoryId: string) => void;
  onChoice: (itemId: string, choice: ChecklistChoice) => void;
};

const ChecklistSection = ({
  category,
  isExpanded,
  answers,
  onToggle,
  onChoice,
}: SectionProps) => {
  const animation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const [renderBody, setRenderBody] = useState(isExpanded);
  const IconComponent = useMemo(
    () => getIconByKey(category.iconKey ?? "shield"),
    [category.iconKey],
  );

  useEffect(() => {
    if (isExpanded) {
      setRenderBody(true);
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
          setRenderBody(false);
        }
      });
    }
  }, [animation, isExpanded]);

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
    [animation],
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
    [animation],
  );

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
          <View style={styles.iconBadge}>
            <IconComponent size={20} color="#282D86" />
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
            <View style={styles.choiceHeader}>
              <Text style={styles.choiceHeaderText}>Sí</Text>
              <Text style={styles.choiceHeaderText}>No</Text>
            </View>
            {category.items.map((item) => {
              const answer = answers?.[item.id] ?? null;
              return (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
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
                      onPress={() => onChoice(item.id, "no")}
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
};

export function DropDown({
  categories,
  value,
  onChange,
  defaultExpanded,
  autoAdvance = true,
}: DropDownProps) {
  const [expandedSections, setExpandedSections] = useState(() => {
    if (defaultExpanded && defaultExpanded.length > 0) {
      return new Set(defaultExpanded);
    }
    return new Set([categories[0]?.id].filter(Boolean));
  });

  const [internalState, setInternalState] = useState<ChecklistState>(() =>
    buildInitialState(categories),
  );

  useEffect(() => {
    setInternalState(buildInitialState(categories));
  }, [categories]);

  const answers = value ?? internalState;

  const emitChange = useCallback(
    (next: ChecklistState) => {
      if (onChange) {
        onChange(next);
      }
      setInternalState(next);
    },
    [onChange],
  );

  const animateLayout = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        180,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  }, []);

  const toggleSection = useCallback(
    (sectionId: string) => {
      animateLayout();
      setExpandedSections((prev) => {
        const next = new Set(prev);
        if (next.has(sectionId)) {
          next.delete(sectionId);
        } else {
          next.add(sectionId);
        }
        return next;
      });
    },
    [animateLayout],
  );

  const goToNextSection = useCallback(
    (currentId: string) => {
      if (!autoAdvance) {
        return;
      }
      const currentIndex = categories.findIndex((c) => c.id === currentId);
      if (currentIndex === -1 || currentIndex === categories.length - 1) {
        return;
      }
      const nextId = categories[currentIndex + 1].id;
      animateLayout();
      setExpandedSections(new Set([nextId]));
    },
    [animateLayout, autoAdvance, categories],
  );

  const handleChoicePress = useCallback(
    (sectionId: string, itemId: string, choice: ChecklistChoice) => {
      const currentSection = answers[sectionId] ?? {};
      const updatedSection = {
        ...currentSection,
        [itemId]: currentSection[itemId] === choice ? null : choice,
      };

      const nextAnswers: ChecklistState = {
        ...answers,
        [sectionId]: updatedSection,
      };

      emitChange(nextAnswers);

      const sectionCompleted = Object.values(updatedSection).every(
        (value) => value === "yes" || value === "no",
      );

      if (sectionCompleted) {
        goToNextSection(sectionId);
      }
    },
    [answers, emitChange, goToNextSection],
  );

  const resolvedCategories = useMemo(() => categories, [categories]);

  return (
    <View style={styles.wrapper}>
      {resolvedCategories.map((category) => (
        <ChecklistSection
          key={category.id}
          category={category}
          isExpanded={expandedSections.has(category.id)}
          answers={answers[category.id] ?? {}}
          onToggle={toggleSection}
          onChoice={(itemId, choice) =>
            handleChoicePress(category.id, itemId, choice)
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 16,
  },
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 15,
    color: "#4A4A68",
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
  choiceHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 36,
    paddingLeft: 80,
  },
  choiceHeaderText: {
    fontSize: 12,
    color: "#9CA0C5",
    fontWeight: "600",
  },
});
