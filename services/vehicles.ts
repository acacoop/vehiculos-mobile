import { Vehicle } from "../interfaces/vehicle";
import { apiClient } from "./apiClient";

type VehicleApiModel = {
  id: string;
  licensePlate: string;
  year: number;
  chassisNumber?: string | null;
  engineNumber?: string | null;
  model?: {
    id: string;
    name: string;
    brand?: { id: string; name: string };
  };
};

type VehiclesResponse = {
  status: "success";
  data: VehicleApiModel[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
};

function mapVehicle(api: VehicleApiModel): Vehicle {
  const brandName = api.model?.brand?.name ?? "";
  const modelName = api.model?.name ?? "";
  return {
    id: api.id,
    licensePlate: api.licensePlate,
    brand: brandName,
    model: modelName,
    year: api.year,
    imgUrl: "",
    engineNumber: api.engineNumber ?? undefined,
    chassisNumber: api.chassisNumber ?? undefined,
  };
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const response = await apiClient.get<VehiclesResponse>("/vehicles", {
    query: { limit: 100, page: 1 },
  });

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapVehicle);
}

export async function getVehicle(
  licensePlate: string
): Promise<Vehicle | null> {
  if (!licensePlate) return null;

  const response = await apiClient.get<VehiclesResponse>("/vehicles", {
    query: { licensePlate: licensePlate.toUpperCase(), limit: 1, page: 1 },
  });

  const first = Array.isArray(response?.data) ? response.data[0] : undefined;
  return first ? mapVehicle(first) : null;
}
