import { Maintenance } from "../../interfaces/maintenance";
import { apiClient } from "../apiClient";

/**
 * Extended Maintenance interface with source indicator
 */
export interface MaintenanceWithSource extends Maintenance {
  source: "assigned" | "possible";
}

/**
 * Grouped maintenances by category with source indicator
 */
export interface GroupedMaintenances {
  assigned: Record<string, MaintenanceWithSource[]>;
  possible: Record<string, MaintenanceWithSource[]>;
}

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

/**
 * API response structure from /maintenance/posibles endpoint
 * MaintenancePosible represents a possible maintenance that can be assigned
 */
type MaintenancePosibleApi = {
  id: string;
  categoryId: string;
  category?: { name: string };
  name: string;
  kilometersFrequency?: number;
  daysFrequency?: number;
  observations?: string;
  instructions?: string;
};

type MaintenancePosiblesResponse = {
  status: "success";
  data: MaintenancePosibleApi[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

function mapMaintenanceRequirement(
  api: MaintenanceRequirementApi
): MaintenanceWithSource {
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
    source: "assigned",
  };
}

function mapMaintenancePosible(
  api: MaintenancePosibleApi
): MaintenanceWithSource {
  const kmFrequency = api.kilometersFrequency ?? 0;
  const daysFreq = api.daysFrequency ?? null;

  const recurrenceParts: string[] = [];
  if (kmFrequency) {
    recurrenceParts.push(`${kmFrequency} km`);
  }
  if (daysFreq) {
    recurrenceParts.push(`${daysFreq} días`);
  }

  return {
    id: api.id,
    maintenanceId: api.id,
    maintenanceName: api.name,
    maintenanceImgName: "",
    maintenanceCategoryName: api.category?.name ?? "Sin categoría",
    kilometersFrequency: kmFrequency,
    daysFrequency: daysFreq,
    recurrencePattern: recurrenceParts.join(" / "),
    source: "possible",
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
 * Get all possible maintenances from the system.
 * Uses the /maintenance/posibles endpoint.
 *
 * @returns List of all possible maintenances
 */
export async function getAllPossibleMaintenances(): Promise<
  MaintenanceWithSource[]
> {
  const response = await apiClient.get<MaintenancePosiblesResponse>(
    "/maintenance/posibles",
    {
      query: {
        limit: 100,
        page: 1,
      },
    }
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenancePosible);
}

/**
 * Get maintenances for a vehicle, grouped by assigned and possible.
 * Assigned maintenances are those specifically assigned to the vehicle model.
 * Possible maintenances are all other maintenances in the system that are not assigned.
 *
 * @param modelId - The vehicle model ID
 * @returns Grouped maintenances by assigned and possible, each grouped by category
 */
export async function getGroupedMaintenancesForVehicle(
  modelId: string
): Promise<GroupedMaintenances> {
  if (!modelId) {
    return { assigned: {}, possible: {} };
  }

  // Fetch both assigned and possible maintenances in parallel
  const [assignedMaintenances, allPossibleMaintenances] = await Promise.all([
    getMaintenanceByVehicleModel(modelId),
    getAllPossibleMaintenances(),
  ]);

  // Get IDs of assigned maintenances to filter them out from possible
  const assignedMaintenanceIds = new Set(
    assignedMaintenances.map((m) => m.maintenanceId)
  );

  // Filter possible maintenances to exclude those already assigned
  const filteredPossibleMaintenances = allPossibleMaintenances.filter(
    (m) => !assignedMaintenanceIds.has(m.maintenanceId)
  );

  // Group assigned maintenances by category
  const assignedGrouped = (
    assignedMaintenances as MaintenanceWithSource[]
  ).reduce(
    (acc, maintenance) => {
      const category = maintenance.maintenanceCategoryName;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ ...maintenance, source: "assigned" });
      return acc;
    },
    {} as Record<string, MaintenanceWithSource[]>
  );

  // Group possible maintenances by category
  const possibleGrouped = filteredPossibleMaintenances.reduce(
    (acc, maintenance) => {
      const category = maintenance.maintenanceCategoryName;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(maintenance);
      return acc;
    },
    {} as Record<string, MaintenanceWithSource[]>
  );

  return {
    assigned: assignedGrouped,
    possible: possibleGrouped,
  };
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
