export type ChecklistChoice = "yes" | "no" | null;

export type ChecklistItem = {
  id: string;
  label: string;
};

export type ChecklistCategory = {
  id: string;
  title: string;
  iconKey?: string;
  items: ChecklistItem[];
};

export type ChecklistState = Record<string, Record<string, ChecklistChoice>>;
