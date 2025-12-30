import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  QuarterlyControlCategory,
  QuarterlyControlObservations,
  QuarterlyControlState,
} from "../../interfaces/quarterlyControls";
import Modal from "../Modal";
import { QuarterlyControlSection, useQuarterlyControlLogic } from ".";

type QuarterlyControlFormProps = {
  categories: QuarterlyControlCategory[];
  value?: QuarterlyControlState;
  onChange?: (next: QuarterlyControlState) => void;
  defaultExpanded?: string[];
  autoAdvance?: boolean;
  observations?: QuarterlyControlObservations;
  onObservationsChange?: (next: QuarterlyControlObservations) => void;
};

export function QuarterlyControlForm({
  categories,
  value,
  onChange,
  defaultExpanded,
  autoAdvance = true,
  observations,
  onObservationsChange,
}: QuarterlyControlFormProps) {
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
  } = useQuarterlyControlLogic({
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
        <QuarterlyControlSection
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
