// Re-export all checklist types
export * from "./types";
export * from "./payloads";

// Backend checklist item status enum values
export const CHECKLIST_ITEM_STATUS = {
  PENDIENTE: "PENDIENTE",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
} as const;

export type ChecklistItemStatus =
  (typeof CHECKLIST_ITEM_STATUS)[keyof typeof CHECKLIST_ITEM_STATUS];

// User type for checklist
export interface ChecklistUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Vehicle type for checklist (simplified)
export interface ChecklistVehicle {
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

// Checklist item from backend
export interface MaintenanceChecklistItem {
  id: string;
  category: string;
  title: string;
  status: ChecklistItemStatus;
  observations: string;
}

// Checklist from backend
export interface MaintenanceChecklist {
  id: string;
  vehicle: ChecklistVehicle;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  intendedDeliveryDate: string;
  filledBy: ChecklistUser | null;
  filledAt: string | null;
  items: MaintenanceChecklistItem[];
}

// API response types
export interface MaintenanceChecklistsResponse {
  status: "success";
  data: MaintenanceChecklist[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface MaintenanceChecklistResponse {
  status: "success";
  data: MaintenanceChecklist;
}

// Checklist status (calculated from items)
export type ChecklistStatus = "Aprobado" | "Rechazado" | "Pendiente";

// History card item (mapped from MaintenanceChecklist)
export interface ChecklistHistoryItem {
  id: string;
  vehicleId: string;
  licensePlate: string;
  quarter: number;
  year: number;
  filledBy: string | null;
  filledAt: string | null;
  status: ChecklistStatus;
  description: string;
}

// Patch payload for updating checklist items
export interface PatchChecklistItemPayload {
  id: string;
  status: ChecklistItemStatus;
  observations: string;
}

export interface PatchChecklistPayload {
  items: PatchChecklistItemPayload[];
}
