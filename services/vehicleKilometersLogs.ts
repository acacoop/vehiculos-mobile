import { apiClient } from "./apiClient";

export interface CreateKilometersLogInput {
  vehicleId: string;
  userId: string;
  date: Date;
  kilometers: number;
}

export interface KilometersLogItem {
  id: string;
  kilometers: number;
  date: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  vehicle: {
    id: string;
    licensePlate: string;
  };
}

interface KilometersLogResponse {
  status: "success";
  data: {
    id: string;
    vehicleId: string;
    userId: string;
    date: string;
    kilometers: number;
  };
  message?: string;
}

interface KilometersLogsListResponse {
  status: "success";
  data: KilometersLogItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function createKilometersLog(
  input: CreateKilometersLogInput,
): Promise<KilometersLogResponse["data"]> {
  const payload = {
    vehicleId: input.vehicleId,
    userId: input.userId,
    date: input.date.toISOString(),
    kilometers: input.kilometers,
  };

  const response = await apiClient.post<KilometersLogResponse>(
    "/vehicle-kilometersLogs",
    payload,
  );

  return response.data;
}

export async function getKilometersLogsByVehicle(
  vehicleId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ items: KilometersLogItem[]; total: number; hasMore: boolean }> {
  const response = await apiClient.get<KilometersLogsListResponse>(
    "/vehicle-kilometersLogs",
    {
      query: {
        vehicleId,
        page,
        limit,
        sortBy: "date",
        sortOrder: "DESC",
      },
    },
  );

  const items = Array.isArray(response?.data) ? response.data : [];
  const total = response?.pagination?.total ?? items.length;
  const hasMore = page * limit < total;

  return { items, total, hasMore };
}
