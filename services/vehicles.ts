import { Vehicle } from "../interfaces/vehicle";
import { apiClient } from "./apiClient";
import { getCurrentUser } from "./me";

type VehicleApiModel = {
  id: string;
  licensePlate: string;
  year: number;
  chassisNumber?: string | null;
  engineNumber?: string | null;
  vehicleType?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
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

type VehicleDetailResponse = {
  status: "success";
  data: VehicleApiModel;
};

// Assignment response types
type AssignmentVehicle = {
  id: string;
  licensePlate: string;
  year: number;
  model: {
    id: string;
    name: string;
    brand: { id: string; name: string };
  };
};

type Assignment = {
  id: string;
  startDate: string;
  endDate?: string;
  vehicle: AssignmentVehicle;
};

type AssignmentsResponse = {
  status: "success";
  data: Assignment[];
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
    vehicleType: api.vehicleType ?? undefined,
    transmission: api.transmission ?? undefined,
    fuelType: api.fuelType ?? undefined,
  };
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const response = await apiClient.get<VehiclesResponse>("/vehicles", {
    query: { limit: 100, page: 1 },
  });

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapVehicle);
}

/**
 * Get vehicles assigned to the current logged-in user
 * Uses /assignments endpoint filtered by userId
 */
export async function getMyVehicles(): Promise<Vehicle[]> {
  // Get current user to obtain userId
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("No se pudo obtener el usuario actual");
  }

  // Get assignments filtered by userId and current date
  const today = new Date().toISOString().split("T")[0];
  const response = await apiClient.get<AssignmentsResponse>("/assignments", {
    query: {
      userId: currentUser.id,
      date: today,
      limit: 100,
      page: 1,
    },
  });

  const assignments = Array.isArray(response?.data) ? response.data : [];

  // Extract vehicles from assignments and map to Vehicle type
  return assignments.map((assignment) => {
    const v = assignment.vehicle;
    return {
      id: v.id,
      licensePlate: v.licensePlate,
      brand: v.model?.brand?.name ?? "",
      model: v.model?.name ?? "",
      year: v.year,
      imgUrl: "",
    };
  });
}

export async function getVehicle(
  licensePlate: string
): Promise<Vehicle | null> {
  if (!licensePlate) return null;

  const response = await apiClient.get<VehiclesResponse>("/vehicles", {
    query: { licensePlate: licensePlate.toUpperCase(), limit: 1, page: 1 },
  });

  const first = Array.isArray(response?.data) ? response.data[0] : undefined;
  if (!first) {
    return null;
  }

  if (!first.id) {
    return mapVehicle(first);
  }

  try {
    const detail = await apiClient.get<VehicleDetailResponse>(
      `/vehicles/${first.id}`
    );

    if (detail?.data) {
      return mapVehicle(detail.data);
    }
  } catch (err) {
    console.warn("No se pudo obtener el detalle del vehículo", err);
  }

  return mapVehicle(first);
}
