import { MaintenanceRecord } from "../interfaces/maintenanceRecord";
import { apiClient } from "./apiClient";

interface MaintenanceRecordApiModel {
  id: string;
  assignedMaintenanceId: string;
  userId: string;
  date: string;
  kilometers: number;
  notes?: string | null;
}

interface MaintenanceRecordsResponse {
  status: "success";
  data: MaintenanceRecordApiModel[];
}

interface MaintenanceRecordResponse {
  status: "success";
  data: MaintenanceRecordApiModel;
}

function mapMaintenanceRecord(
  api: MaintenanceRecordApiModel,
): MaintenanceRecord {
  return {
    id: api.id,
    assignedMaintenanceId: api.assignedMaintenanceId,
    userId: api.userId,
    date: new Date(api.date),
    kilometers: api.kilometers,
    notes: api.notes ?? undefined,
  };
}

export async function getMaintenanceRecordsByAssignedMaintenance(
  assignedMaintenanceId: string,
): Promise<MaintenanceRecord[]> {
  if (!assignedMaintenanceId) return [];

  const response = await apiClient.get<MaintenanceRecordsResponse>(
    "/maintenance/records",
    {
      query: {
        assignedMaintenanceId,
        limit: 100,
        page: 1,
      },
    },
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenanceRecord);
}

export interface CreateMaintenanceRecordInput {
  assignedMaintenanceId: string;
  userId: string;
  date: Date;
  kilometers: number;
  notes?: string;
}

export async function createMaintenanceRecord(
  input: CreateMaintenanceRecordInput,
): Promise<MaintenanceRecord> {
  const payload = {
    assignedMaintenanceId: input.assignedMaintenanceId,
    userId: input.userId,
    date: input.date.toISOString(),
    kilometers: input.kilometers,
    notes: input.notes ?? null,
  };

  const response = await apiClient.post<MaintenanceRecordResponse>(
    "/maintenance/records",
    payload,
  );

  return mapMaintenanceRecord(response.data);
}
