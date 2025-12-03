// Re-export types from types.ts
export * from "./types";

// Backend quarterly control item status enum values
export const QUARTERLY_CONTROL_ITEM_STATUS = {
  PENDIENTE: "PENDIENTE",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
} as const;

export type QuarterlyControlItemStatus =
  (typeof QUARTERLY_CONTROL_ITEM_STATUS)[keyof typeof QUARTERLY_CONTROL_ITEM_STATUS];

// Quarter type (1-4)
export type Quarter = 1 | 2 | 3 | 4;

// User type for quarterly control
export interface QuarterlyControlUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Vehicle type for quarterly control (simplified)
export interface QuarterlyControlVehicle {
  id: string;
  licensePlate: string;
  year: number;
  model: {
    id: string;
    name: string;
    brand: {
      id: string;
      name: string;
    };
  };
}

// Quarterly control item from backend
export interface QuarterlyControlItem {
  id: string;
  category: string;
  title: string;
  status: QuarterlyControlItemStatus;
  observations: string;
}

// Quarterly control from backend
export interface QuarterlyControl {
  id: string;
  vehicle: QuarterlyControlVehicle;
  year: number;
  quarter: Quarter;
  intendedDeliveryDate: string;
  filledBy: QuarterlyControlUser | null;
  filledAt: string | null;
  items: QuarterlyControlItem[];
}

// API response types
export interface QuarterlyControlsResponse {
  status: "success";
  data: QuarterlyControl[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface QuarterlyControlResponse {
  status: "success";
  data: QuarterlyControl;
}

// Quarterly control status (calculated from items)
export type QuarterlyControlStatus = "Aprobado" | "Rechazado" | "Pendiente";

// History card item (mapped from QuarterlyControl)
export interface QuarterlyControlHistoryItem {
  id: string;
  vehicleId: string;
  licensePlate: string;
  quarter: number;
  year: number;
  filledBy: string | null;
  filledAt: string | null;
  status: QuarterlyControlStatus;
  description: string;
}

// Patch payload for updating quarterly control items
export interface PatchQuarterlyControlItemPayload {
  id: string;
  status: QuarterlyControlItemStatus;
  observations: string;
}

export interface PatchQuarterlyControlPayload {
  items: PatchQuarterlyControlItemPayload[];
}
