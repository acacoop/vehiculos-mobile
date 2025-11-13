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
  ChecklistObservations,
  ChecklistState,
} from "../interfaces/checklists/types";
import { Icon, getIconByKey } from "./Icons";
import Modal from "./Modal";

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
  observations?: ChecklistObservations;
  onObservationsChange?: (next: ChecklistObservations) => void;
};

const buildInitialState = (categories: ChecklistCategory[]): ChecklistState => {
  return categories.reduce<ChecklistState>((acc, category) => {
    acc[category.id] = category.items.reduce<Record<string, ChecklistChoice>>(
      (itemAcc, item) => {
        itemAcc[item.id] = null;
        return itemAcc;
      },
      {}
    );
    return acc;
  }, {});
};

const buildInitialObservations = (
  categories: ChecklistCategory[]
): ChecklistObservations => {
  return categories.reduce<ChecklistObservations>((acc, category) => {
    acc[category.id] = category.items.reduce<Record<string, string>>(
      (itemAcc, item) => {
        itemAcc[item.id] = "";
        return itemAcc;
      },
      {}
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
  onOpenObservation: (itemId: string) => void;
  observations: Record<string, string>;
};

const ChecklistSection = ({
  category,
  isExpanded,
  answers,
  onToggle,
  onChoice,
  onOpenObservation,
  observations,
}: SectionProps) => {
  const animation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const [renderBody, setRenderBody] = useState(isExpanded);
  const IconComponent = useMemo(
    () => getIconByKey(category.iconKey ?? "shield"),
    [category.iconKey]
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
              // const note = observations?.[item.id] ?? "";
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
};

export function DropDown({
  categories,
  value,
  onChange,
  defaultExpanded,
  autoAdvance = true,
  observations,
  onObservationsChange,
}: DropDownProps) {
  const [expandedSections, setExpandedSections] = useState(() => {
    if (defaultExpanded && defaultExpanded.length > 0) {
      return new Set(defaultExpanded);
    }
    return new Set([categories[0]?.id].filter(Boolean));
  });

  const [internalState, setInternalState] = useState<ChecklistState>(() =>
    buildInitialState(categories)
  );

  const [internalObservations, setInternalObservations] =
    useState<ChecklistObservations>(() => buildInitialObservations(categories));

  useEffect(() => {
    setInternalState(buildInitialState(categories));
  }, [categories]);

  useEffect(() => {
    setInternalObservations(buildInitialObservations(categories));
  }, [categories]);

  const answers = value ?? internalState;
  const observationState = observations ?? internalObservations;

  const emitChange = useCallback(
    (next: ChecklistState) => {
      if (onChange) {
        onChange(next);
      }
      setInternalState(next);
    },
    [onChange]
  );

  const emitObservationsChange = useCallback(
    (next: ChecklistObservations) => {
      if (onObservationsChange) {
        onObservationsChange(next);
      }
      setInternalObservations(next);
    },
    [onObservationsChange]
  );

  const animateLayout = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        180,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
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
    [animateLayout]
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
    [animateLayout, autoAdvance, categories]
  );

  const handleChoicePress = useCallback(
    (
      sectionId: string,
      itemId: string,
      choice: ChecklistChoice,
      options?: { note?: string; forceChoice?: boolean }
    ) => {
      const currentSection = answers[sectionId] ?? {};
      const currentValue = currentSection[itemId] ?? null;
      let nextValue: ChecklistChoice;

      if (options?.forceChoice) {
        nextValue = choice;
      } else if (currentValue === choice) {
        nextValue = null;
      } else {
        nextValue = choice;
      }

      const updatedSection: Record<string, ChecklistChoice> = {
        ...currentSection,
        [itemId]: nextValue,
      };

      const nextAnswers: ChecklistState = {
        ...answers,
        [sectionId]: updatedSection,
      };

      emitChange(nextAnswers);

      const currentObservationSection = observationState[sectionId] ?? {};
      const nextObservationSection: Record<string, string> = {
        ...currentObservationSection,
        [itemId]:
          nextValue === "no"
            ? (options?.note ?? currentObservationSection[itemId] ?? "")
            : "",
      };

      const nextObservationState: ChecklistObservations = {
        ...observationState,
        [sectionId]: nextObservationSection,
      };

      emitObservationsChange(nextObservationState);

      const sectionCompleted = Object.values(updatedSection).every(
        (value) => value === "yes" || value === "no"
      );

      if (sectionCompleted) {
        goToNextSection(sectionId);
      }
    },
    [
      answers,
      observationState,
      emitChange,
      emitObservationsChange,
      goToNextSection,
    ]
  );

  const [observationModalTarget, setObservationModalTarget] = useState<{
    sectionId: string;
    itemId: string;
  } | null>(null);
  const [observationDraft, setObservationDraft] = useState("");

  const closeObservationModal = useCallback(() => {
    setObservationModalTarget(null);
    setObservationDraft("");
  }, []);

  const openObservationModal = useCallback(
    (sectionId: string, itemId: string) => {
      const existingNote = observationState[sectionId]?.[itemId] ?? "";
      setObservationDraft(existingNote);
      setObservationModalTarget({ sectionId, itemId });
    },
    [observationState]
  );

  const confirmObservation = useCallback(() => {
    if (!observationModalTarget) {
      return;
    }
    handleChoicePress(
      observationModalTarget.sectionId,
      observationModalTarget.itemId,
      "no",
      {
        note: observationDraft.trim(),
        forceChoice: true,
      }
    );
    closeObservationModal();
  }, [
    handleChoicePress,
    observationDraft,
    observationModalTarget,
    closeObservationModal,
  ]);

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
          onOpenObservation={(itemId) =>
            openObservationModal(category.id, itemId)
          }
          observations={observationState[category.id] ?? {}}
        />
      ))}
      <Modal
        visible={!!observationModalTarget}
        title="Agregar observación"
        value={observationDraft}
        onChangeText={setObservationDraft}
        onCancel={closeObservationModal}
        onConfirm={confirmObservation}
        confirmDisabled={observationDraft.trim().length === 0}
      />
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
  observationText: {
    fontSize: 13,
    color: "#9CA0C5",
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
    gap: 30,
    paddingRight: 7,
  },
  choiceHeaderText: {
    fontSize: 12,
    color: "#9CA0C5",
    fontWeight: "600",
  },
});
