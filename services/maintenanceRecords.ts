import { MaintenanceRecord } from "../interfaces/maintenanceRecord";
import { apiClient } from "./apiClient";

interface MaintenanceRecordApiModel {
  id: string;
  maintenanceId?: string;
  vehicleId?: string;
  userId?: string;
  date: string;
  notes?: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  maintenance?: {
    id: string;
    name: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
  };
  kilometersLog?: {
    id: string;
    kilometers: number;
    date: string;
  };
  // Legacy field for backwards compatibility
  kilometers?: number;
}

interface MaintenanceRecordsResponse {
  status: "success";
  data: MaintenanceRecordApiModel[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface MaintenanceRecordResponse {
  status: "success";
  data: MaintenanceRecordApiModel;
}

function mapMaintenanceRecord(
  api: MaintenanceRecordApiModel,
): MaintenanceRecord {
  // Kilometers can come from kilometersLog or directly
  const kilometers = api.kilometersLog?.kilometers ?? api.kilometers ?? 0;

  return {
    id: api.id,
    maintenanceId: api.maintenance?.id ?? api.maintenanceId ?? "",
    vehicleId: api.vehicle?.id ?? api.vehicleId ?? "",
    userId: api.user?.id ?? api.userId ?? "",
    date: new Date(api.date),
    kilometers,
    notes: api.notes ?? undefined,
    user: api.user
      ? {
          id: api.user.id,
          firstName: api.user.firstName,
          lastName: api.user.lastName,
          email: api.user.email,
        }
      : undefined,
  };
}

export interface MaintenanceRecordsFilter {
  vehicleId?: string;
  maintenanceId?: string;
  userId?: string;
}

export async function getMaintenanceRecords(
  filter: MaintenanceRecordsFilter,
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
        sortBy: "date",
        sortOrder: "DESC",
      },
    },
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapMaintenanceRecord);
}

export async function getMaintenanceRecordsPaginated(
  filter: MaintenanceRecordsFilter,
  page: number = 1,
  limit: number = 10,
): Promise<{ items: MaintenanceRecord[]; total: number; hasMore: boolean }> {
  const { vehicleId, maintenanceId, userId } = filter;
  if (!vehicleId && !maintenanceId && !userId) {
    return { items: [], total: 0, hasMore: false };
  }

  const response = await apiClient.get<MaintenanceRecordsResponse>(
    "/maintenance/records",
    {
      query: {
        ...(vehicleId && { vehicleId }),
        ...(maintenanceId && { maintenanceId }),
        ...(userId && { userId }),
        limit,
        page,
        sortBy: "date",
        sortOrder: "DESC",
      },
    },
  );

  const items = Array.isArray(response?.data) ? response.data : [];
  const total = response?.pagination?.total ?? items.length;
  const hasMore = page * limit < total;

  return {
    items: items.map(mapMaintenanceRecord),
    total,
    hasMore,
  };
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
  input: CreateMaintenanceRecordInput,
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
    payload,
  );

  return mapMaintenanceRecord(response.data);
}
