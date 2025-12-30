import { apiClient } from "./apiClient";
import {
  QuarterlyControl,
  QuarterlyControlsResponse,
  QuarterlyControlResponse,
  QuarterlyControlHistoryItem,
  QuarterlyControlStatus,
  PatchQuarterlyControlPayload,
  QUARTERLY_CONTROL_ITEM_STATUS,
  Quarter,
} from "../interfaces/quarterlyControls";

/**
 * Calculate the overall status of a quarterly control based on its items
 */
function calculateQuarterlyControlStatus(
  items: QuarterlyControl["items"],
): QuarterlyControlStatus {
  if (!items || items.length === 0) {
    return "Pendiente";
  }

  const hasRejected = items.some(
    (item) => item.status === QUARTERLY_CONTROL_ITEM_STATUS.RECHAZADO,
  );
  if (hasRejected) {
    return "Rechazado";
  }

  const allApproved = items.every(
    (item) => item.status === QUARTERLY_CONTROL_ITEM_STATUS.APROBADO,
  );
  if (allApproved) {
    return "Aprobado";
  }

  return "Pendiente";
}

/**
 * Get status description for display
 */
function getStatusDescription(status: QuarterlyControlStatus): string {
  switch (status) {
    case "Rechazado":
      return "Con observaciones";
    case "Aprobado":
      return "Sin fallas";
    case "Pendiente":
    default:
      return "Pendiente de realizar";
  }
}

/**
 * Map backend quarterly control to history item for display
 */
function mapQuarterlyControlToHistoryItem(
  control: QuarterlyControl,
): QuarterlyControlHistoryItem {
  const status = calculateQuarterlyControlStatus(control.items);
  const filledByName = control.filledBy
    ? `${control.filledBy.firstName} ${control.filledBy.lastName}`
    : null;

  return {
    id: control.id,
    vehicleId: control.vehicle.id,
    licensePlate: control.vehicle.licensePlate,
    quarter: control.quarter,
    year: control.year,
    filledBy: filledByName,
    filledAt: control.filledAt,
    status,
    description: getStatusDescription(status),
  };
}

export interface GetQuarterlyControlsParams {
  vehicleId?: string;
  year?: number;
  quarter?: Quarter;
  limit?: number;
  page?: number;
}

/**
 * Get all quarterly controls with optional filters
 */
export async function getQuarterlyControls(
  params?: GetQuarterlyControlsParams,
): Promise<QuarterlyControl[]> {
  const response = await apiClient.get<QuarterlyControlsResponse>(
    "/quarterly-controls",
    {
      query: {
        vehicleId: params?.vehicleId,
        year: params?.year,
        quarter: params?.quarter,
        limit: params?.limit ?? 100,
        page: params?.page ?? 1,
      },
    },
  );

  return Array.isArray(response?.data) ? response.data : [];
}

/**
 * Get quarterly controls for a specific vehicle and map them to history items
 */
export async function getQuarterlyControlHistoryByVehicle(
  vehicleId: string,
): Promise<QuarterlyControlHistoryItem[]> {
  const controls = await getQuarterlyControls({ vehicleId });
  return controls.map(mapQuarterlyControlToHistoryItem);
}

/**
 * Get a single quarterly control by ID
 */
export async function getQuarterlyControlById(
  controlId: string,
): Promise<QuarterlyControl | null> {
  try {
    const response = await apiClient.get<QuarterlyControlResponse>(
      `/quarterly-controls/${controlId}`,
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching quarterly control:", error);
    return null;
  }
}

/**
 * Update a quarterly control with item responses (PATCH)
 */
export async function updateQuarterlyControlItems(
  controlId: string,
  payload: PatchQuarterlyControlPayload,
): Promise<QuarterlyControl | null> {
  try {
    const response = await apiClient.patch<QuarterlyControlResponse>(
      `/quarterly-controls/${controlId}/with-items`,
      payload,
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error updating quarterly control:", error);
    throw error;
  }
}
