import { apiClient } from "./apiClient";
import {
  MaintenanceChecklist,
  MaintenanceChecklistsResponse,
  MaintenanceChecklistResponse,
  ChecklistHistoryItem,
  ChecklistStatus,
  PatchChecklistPayload,
  CHECKLIST_ITEM_STATUS,
} from "../interfaces/checklists";

/**
 * Calculate the overall status of a checklist based on its items
 */
function calculateChecklistStatus(
  items: MaintenanceChecklist["items"]
): ChecklistStatus {
  if (!items || items.length === 0) {
    return "Pendiente";
  }

  const hasRejected = items.some(
    (item) => item.status === CHECKLIST_ITEM_STATUS.RECHAZADO
  );
  if (hasRejected) {
    return "Rechazado";
  }

  const allApproved = items.every(
    (item) => item.status === CHECKLIST_ITEM_STATUS.APROBADO
  );
  if (allApproved) {
    return "Aprobado";
  }

  return "Pendiente";
}

/**
 * Get status description for display
 */
function getStatusDescription(status: ChecklistStatus): string {
  switch (status) {
    case "Rechazado":
      return "Con errores";
    case "Aprobado":
      return "Sin fallas";
    case "Pendiente":
    default:
      return "Pendiente de realizar";
  }
}

/**
 * Map backend checklist to history item for display
 */
function mapChecklistToHistoryItem(
  checklist: MaintenanceChecklist
): ChecklistHistoryItem {
  const status = calculateChecklistStatus(checklist.items);
  const filledByName = checklist.filledBy
    ? `${checklist.filledBy.firstName} ${checklist.filledBy.lastName}`
    : null;

  return {
    id: checklist.id,
    vehicleId: checklist.vehicle.id,
    licensePlate: checklist.vehicle.licensePlate,
    quarter: checklist.quarter,
    year: checklist.year,
    filledBy: filledByName,
    filledAt: checklist.filledAt,
    status,
    description: getStatusDescription(status),
  };
}

export interface GetChecklistsParams {
  vehicleId?: string;
  year?: number;
  quarter?: 1 | 2 | 3 | 4;
  limit?: number;
  page?: number;
}

/**
 * Get all maintenance checklists with optional filters
 */
export async function getMaintenanceChecklists(
  params?: GetChecklistsParams
): Promise<MaintenanceChecklist[]> {
  const response = await apiClient.get<MaintenanceChecklistsResponse>(
    "/maintenance/checklists",
    {
      query: {
        vehicleId: params?.vehicleId,
        year: params?.year,
        quarter: params?.quarter,
        limit: params?.limit ?? 100,
        page: params?.page ?? 1,
      },
    }
  );

  return Array.isArray(response?.data) ? response.data : [];
}

/**
 * Get checklists for a specific vehicle and map them to history items
 */
export async function getChecklistHistoryByVehicle(
  vehicleId: string
): Promise<ChecklistHistoryItem[]> {
  const checklists = await getMaintenanceChecklists({ vehicleId });
  return checklists.map(mapChecklistToHistoryItem);
}

/**
 * Get a single maintenance checklist by ID
 */
export async function getMaintenanceChecklistById(
  checklistId: string
): Promise<MaintenanceChecklist | null> {
  try {
    const response = await apiClient.get<MaintenanceChecklistResponse>(
      `/maintenance/checklists/${checklistId}`
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return null;
  }
}

/**
 * Update a checklist with item responses (PATCH)
 */
export async function updateChecklistItems(
  checklistId: string,
  payload: PatchChecklistPayload
): Promise<MaintenanceChecklist | null> {
  try {
    const response = await apiClient.patch<MaintenanceChecklistResponse>(
      `/maintenance/checklists/${checklistId}/with-items`,
      payload
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error updating checklist:", error);
    throw error;
  }
}
