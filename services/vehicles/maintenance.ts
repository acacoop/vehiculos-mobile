import { Maintenance } from "../../interfaces/maintenance";
import { apiClient } from "../apiClient";

/**
 * API response structure from /maintenance/requirements endpoint
 * MaintenanceRequirement represents a maintenance assigned to a vehicle model
 */
type MaintenanceRequirementApi = {
  id: string;
  model: {
    id: string;
    name: string;
    vehicleType?: string;
    brand: {
      id: string;
      name: string;
    };
  };
  maintenance: {
    id: string;
    categoryId: string;
    category: { name: string };
    name: string;
    kilometersFrequency?: number;
    daysFrequency?: number;
    observations?: string;
    instructions?: string;
  };
  // Override frequencies at requirement level (if different from base maintenance)
  kilometersFrequency?: number;
  daysFrequency?: number;
  observations?: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
};

type MaintenanceRequirementsResponse = {
  status: "success";
  data: MaintenanceRequirementApi[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

function mapMaintenanceRequirement(
  api: MaintenanceRequirementApi
): Maintenance {
  // Use requirement-level frequencies if available, otherwise fall back to base maintenance
  const kmFrequency =
    api.kilometersFrequency ?? api.maintenance.kilometersFrequency ?? 0;
  const daysFreq = api.daysFrequency ?? api.maintenance.daysFrequency ?? null;

  const recurrenceParts: string[] = [];
  if (kmFrequency) {
    recurrenceParts.push(`${kmFrequency} km`);
  }
  if (daysFreq) {
    recurrenceParts.push(`${daysFreq} días`);
  }

  return {
    id: api.id,
    maintenanceId: api.maintenance.id,
    maintenanceName: api.maintenance.name,
    maintenanceImgName: "",
    maintenanceCategoryName: api.maintenance.category.name,
    kilometersFrequency: kmFrequency,
    daysFrequency: daysFreq,
    recurrencePattern: recurrenceParts.join(" / "),
  };
}

/**
 * Get maintenances assigned to a vehicle based on its model.
 * Uses the /maintenance/requirements endpoint filtered by modelId.
 *
 * @param modelId - The vehicle model ID to get maintenance requirements for
 * @returns List of maintenances assigned to the vehicle's model
 */
export async function getMaintenanceByVehicleModel(
  modelId: string
): Promise<Maintenance[]> {
  if (!modelId) return [];

  // Get today's date to filter only active requirements
  const today = new Date().toISOString().split("T")[0];

  const response = await apiClient.get<MaintenanceRequirementsResponse>(
    "/maintenance/requirements",
    {
      query: {
        modelId,
        activeAt: today,
        limit: 100,
        page: 1,
      },
    }
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenanceRequirement);
}

/**
 * @deprecated Use getMaintenanceByVehicleModel instead.
 * This function is kept for backward compatibility but the old endpoint no longer exists.
 */
export async function getMaintenanceByVehicle(
  vehicleId: string
): Promise<Maintenance[]> {
  console.warn(
    "getMaintenanceByVehicle is deprecated. Use getMaintenanceByVehicleModel with modelId instead."
  );
  // This will fail since the endpoint doesn't exist anymore
  // The caller should migrate to getMaintenanceByVehicleModel
  return [];
}

export async function getMaintenanceById(id: string): Promise<Maintenance> {
  throw new Error("getMaintenanceById no está implementado todavía");
}
