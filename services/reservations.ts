import { Reservation } from "../interfaces/reservation";
import { apiClient } from "./apiClient";

interface ReservationApiModel {
  id: string;
  startDate: string;
  endDate: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  vehicle: {
    id: string;
    licensePlate: string;
    model?: {
      name?: string | null;
      brand?: {
        name?: string | null;
      } | null;
    } | null;
  };
}

interface ReservationsResponse {
  status: "success";
  data: ReservationApiModel[];
  message?: string;
}

interface ReservationResponse {
  status: "success";
  data: ReservationApiModel;
  message?: string;
}

const mapReservation = (api: ReservationApiModel): Reservation => {
  const brand = api.vehicle.model?.brand?.name ?? "";
  const model = api.vehicle.model?.name ?? "";

  return {
    id: api.id,
    vehicleId: api.vehicle.id,
    licensePlate: api.vehicle.licensePlate,
    vehicleBrand: brand,
    vehicleModel: model,
    startDate: new Date(api.startDate),
    endDate: new Date(api.endDate),
    user: {
      id: api.user.id,
      firstName: api.user.firstName,
      lastName: api.user.lastName,
      email: api.user.email,
    },
  };
};

export async function getReservationsByVehicle(
  vehicleId: string
): Promise<Reservation[]> {
  if (!vehicleId) return [];

  const response = await apiClient.get<ReservationsResponse>(
    `/reservations/vehicle/${vehicleId}`
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapReservation);
}

export async function getReservationsByUser(
  userId: string
): Promise<Reservation[]> {
  if (!userId) return [];

  const response = await apiClient.get<ReservationsResponse>(
    `/reservations/user/${userId}`
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map(mapReservation);
}

export interface CreateReservationInput {
  vehicleId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
}

export async function createReservation(
  input: CreateReservationInput
): Promise<Reservation> {
  const payload = {
    vehicleId: input.vehicleId,
    userId: input.userId,
    startDate: input.startDate.toISOString(),
    endDate: input.endDate.toISOString(),
  };

  const response = await apiClient.post<ReservationResponse>(
    "/reservations",
    payload
  );

  return mapReservation(response.data);
}
