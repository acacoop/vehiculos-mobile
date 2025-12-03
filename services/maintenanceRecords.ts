import { MaintenanceRecord } from "../interfaces/maintenanceRecord";
import { apiClient } from "./apiClient";

interface MaintenanceRecordApiModel {
  id: string;
  maintenanceId: string;
  vehicleId: string;
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
  api: MaintenanceRecordApiModel
): MaintenanceRecord {
  return {
    id: api.id,
    maintenanceId: api.maintenanceId,
    vehicleId: api.vehicleId,
    userId: api.userId,
    date: new Date(api.date),
    kilometers: api.kilometers,
    notes: api.notes ?? undefined,
  };
}

export interface MaintenanceRecordsFilter {
  vehicleId?: string;
  maintenanceId?: string;
  userId?: string;
}

export async function getMaintenanceRecords(
  filter: MaintenanceRecordsFilter
): Promise<MaintenanceRecord[]> {
  const { vehicleId, maintenanceId, userId } = filter;
  if (!vehicleId && !maintenanceId && !userId) return [];

  const response = await apiClient.get<MaintenanceRecordsResponse>(
    "/maintenance/records",
    {
      query: {
        ...(vehicleId && { vehicleId }),
        ...(maintenanceId && { maintenanceId }),
        ...(userId && { userId }),
        limit: 100,
        page: 1,
      },
    }
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenanceRecord);
}

export interface CreateMaintenanceRecordInput {
  maintenanceId: string;
  vehicleId: string;
  userId: string;
  date: Date;
  kilometers: number;
  notes?: string;
}

export async function createMaintenanceRecord(
  input: CreateMaintenanceRecordInput
): Promise<MaintenanceRecord> {
  const payload = {
    maintenanceId: input.maintenanceId,
    vehicleId: input.vehicleId,
    userId: input.userId,
    date: input.date.toISOString().split("T")[0], // Backend expects date in YYYY-MM-DD format
    kilometers: input.kilometers,
    notes: input.notes ?? null,
  };

  const response = await apiClient.post<MaintenanceRecordResponse>(
    "/maintenance/records",
    payload
  );

  return mapMaintenanceRecord(response.data);
}
