import { apiClient } from "./apiClient";

export interface CreateKilometersLogInput {
  vehicleId: string;
  userId: string;
  date: Date;
  kilometers: number;
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

export async function createKilometersLog(
  input: CreateKilometersLogInput
): Promise<KilometersLogResponse["data"]> {
  const payload = {
    vehicleId: input.vehicleId,
    userId: input.userId,
    date: input.date.toISOString(),
    kilometers: input.kilometers,
  };

  const response = await apiClient.post<KilometersLogResponse>(
    "/vehicle-kilometersLogs",
    payload
  );

  return response.data;
}
