import React, { useMemo } from "react";
import { StyleSheet, View, Platform, UIManager } from "react-native";
import {
  ChecklistCategory,
  ChecklistObservations,
  ChecklistState,
} from "../interfaces/checklists";
import Modal from "./Modal";
import { ChecklistSection, useChecklistLogic } from "./checklist";

// Enable LayoutAnimation on Android
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

export function DropDown({
  categories,
  value,
  onChange,
  defaultExpanded,
  autoAdvance = true,
  observations,
  onObservationsChange,
}: DropDownProps) {
  const {
    expandedSections,
    answers,
    observationState,
    observationModalTarget,
    observationDraft,
    toggleSection,
    handleChoicePress,
    openObservationModal,
    closeObservationModal,
    confirmObservation,
    setObservationDraft,
  } = useChecklistLogic({
    categories,
    value,
    onChange,
    defaultExpanded,
    autoAdvance,
    observations,
    onObservationsChange,
  });

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 16,
  },
});
