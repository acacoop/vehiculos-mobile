export type QuarterlyControlChoice = "yes" | "no" | null;

export type QuarterlyControlItemUI = {
  id: string;
  label: string;
};

export type QuarterlyControlCategory = {
  id: string;
  title: string;
  iconKey?: string;
  items: QuarterlyControlItemUI[];
};

export type QuarterlyControlState = Record<
  string,
  Record<string, QuarterlyControlChoice>
>;

export type QuarterlyControlObservations = Record<
  string,
  Record<string, string>
>;
