import { Maintenance } from "../../interfaces/maintenance";
import { apiClient } from "../apiClient";

type AssignedMaintenanceApi = {
  id: string;
  vehicleId: string;
  maintenanceId: string;
  kilometersFrequency?: number | null;
  daysFrequency?: number | null;
  maintenance_name: string;
  maintenance_category_name?: string | null;
};

type MaintenanceAssignmentsResponse = {
  status: "success";
  data: AssignedMaintenanceApi[];
};

function mapMaintenance(api: AssignedMaintenanceApi): Maintenance {
  const recurrenceParts: string[] = [];
  if (api.kilometersFrequency) {
    recurrenceParts.push(`${api.kilometersFrequency} km`);
  }
  if (api.daysFrequency) {
    recurrenceParts.push(`${api.daysFrequency} días`);
  }

  return {
    id: api.id,
    maintenanceName: api.maintenance_name,
    maintenanceImgName: "",
    maintenanceCategoryName: api.maintenance_category_name ?? "",
    kilometersFrequency: api.kilometersFrequency ?? 0,
    recurrencePattern: recurrenceParts.join(" / "),
  };
}

export async function getMaintenanceByVehicle(
  vehicle_id: string
): Promise<Maintenance[]> {
  if (!vehicle_id) return [];

  const response = await apiClient.get<MaintenanceAssignmentsResponse>(
    `/maintenance/assignments/${vehicle_id}`
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenance);
}

export async function getMaintenanceById(id: string): Promise<Maintenance> {
  throw new Error("getMaintenanceById no está implementado todavía");
}
