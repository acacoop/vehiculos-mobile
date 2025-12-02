import { useState, useEffect, useCallback } from "react";
import { LayoutAnimation } from "react-native";
import {
  ChecklistCategory,
  ChecklistChoice,
  ChecklistObservations,
  ChecklistState,
} from "../../interfaces/checklists";

// Helper functions for initializing state
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

export type UseChecklistLogicOptions = {
  categories: ChecklistCategory[];
  value?: ChecklistState;
  onChange?: (next: ChecklistState) => void;
  defaultExpanded?: string[];
  autoAdvance?: boolean;
  observations?: ChecklistObservations;
  onObservationsChange?: (next: ChecklistObservations) => void;
};

export type ObservationModalTarget = {
  sectionId: string;
  itemId: string;
} | null;

export type UseChecklistLogicResult = {
  // State
  expandedSections: Set<string>;
  answers: ChecklistState;
  observationState: ChecklistObservations;
  observationModalTarget: ObservationModalTarget;
  observationDraft: string;

  // Handlers
  toggleSection: (sectionId: string) => void;
  handleChoicePress: (
    sectionId: string,
    itemId: string,
    choice: ChecklistChoice
  ) => void;
  openObservationModal: (sectionId: string, itemId: string) => void;
  closeObservationModal: () => void;
  confirmObservation: () => void;
  setObservationDraft: (value: string) => void;
};

export function useChecklistLogic({
  categories,
  value,
  onChange,
  defaultExpanded,
  autoAdvance = true,
  observations,
  onObservationsChange,
}: UseChecklistLogicOptions): UseChecklistLogicResult {
  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState(() => {
    if (defaultExpanded && defaultExpanded.length > 0) {
      return new Set(defaultExpanded);
    }
    return new Set([categories[0]?.id].filter(Boolean));
  });

  // Internal state for controlled/uncontrolled pattern
  const [internalState, setInternalState] = useState<ChecklistState>(() =>
    buildInitialState(categories)
  );

  const [internalObservations, setInternalObservations] =
    useState<ChecklistObservations>(() => buildInitialObservations(categories));

  // Observation modal state
  const [observationModalTarget, setObservationModalTarget] =
    useState<ObservationModalTarget>(null);
  const [observationDraft, setObservationDraft] = useState("");

  // Sync internal state when categories change
  useEffect(() => {
    setInternalState(buildInitialState(categories));
  }, [categories]);

  useEffect(() => {
    setInternalObservations(buildInitialObservations(categories));
  }, [categories]);

  // Resolve controlled vs uncontrolled values
  const answers = value ?? internalState;
  const observationState = observations ?? internalObservations;

  // Emit changes to parent (if controlled) and update internal state
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

  // Layout animation helper
  const animateLayout = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        180,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
  }, []);

  // Toggle section expansion
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

  // Auto-advance to next section
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

  // Handle choice selection (yes/no)
  const handleChoicePress = useCallback(
    (sectionId: string, itemId: string, choice: ChecklistChoice) => {
      const currentSection = answers[sectionId] ?? {};
      const currentValue = currentSection[itemId] ?? null;

      // Toggle: si ya está seleccionado, lo deselecciona
      const nextValue: ChecklistChoice =
        currentValue === choice ? null : choice;

      const updatedSection: Record<string, ChecklistChoice> = {
        ...currentSection,
        [itemId]: nextValue,
      };

      const nextAnswers: ChecklistState = {
        ...answers,
        [sectionId]: updatedSection,
      };

      emitChange(nextAnswers);

      // Check if section is completed and auto-advance
      const sectionCompleted = Object.values(updatedSection).every(
        (value) => value === "yes" || value === "no"
      );

      if (sectionCompleted) {
        goToNextSection(sectionId);
      }
    },
    [answers, emitChange, goToNextSection]
  );

  // Observation modal handlers
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

    // Only save the observation, don't change the check state
    const { sectionId, itemId } = observationModalTarget;
    const currentObservationSection = observationState[sectionId] ?? {};
    const nextObservationSection: Record<string, string> = {
      ...currentObservationSection,
      [itemId]: observationDraft.trim(),
    };

    const nextObservationState: ChecklistObservations = {
      ...observationState,
      [sectionId]: nextObservationSection,
    };

    emitObservationsChange(nextObservationState);
    closeObservationModal();
  }, [
    observationState,
    observationDraft,
    observationModalTarget,
    emitObservationsChange,
    closeObservationModal,
  ]);

  return {
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
  };
}
