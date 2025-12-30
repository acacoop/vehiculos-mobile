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

/**
 * Format a Date to ISO date string in local timezone (YYYY-MM-DD)
 * This avoids timezone conversion issues with toISOString()
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get timezone offset string in format +HH:MM or -HH:MM
 */
function getTimezoneOffset(date: Date): string {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

/**
 * Format a Date to ISO datetime string with timezone offset
 * Example: 2025-12-01T10:00:00-03:00
 */
function formatLocalDateTime(date: Date): string {
  const datePart = formatLocalDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const offset = getTimezoneOffset(date);
  return `${datePart}T${hours}:${minutes}:${seconds}${offset}`;
}

export async function createReservation(
  input: CreateReservationInput
): Promise<Reservation> {
  const payload = {
    vehicleId: input.vehicleId,
    userId: input.userId,
    startDate: formatLocalDateTime(input.startDate),
    endDate: formatLocalDateTime(input.endDate),
  };

  const response = await apiClient.post<ReservationResponse>(
    "/reservations",
    payload
  );

  return mapReservation(response.data);
}

export interface UpdateReservationInput {
  startDate?: Date;
  endDate?: Date;
}

export async function updateReservation(
  reservationId: string,
  input: UpdateReservationInput
): Promise<Reservation> {
  const payload: Record<string, string> = {};

  if (input.startDate) {
    payload.startDate = formatLocalDateTime(input.startDate);
  }
  if (input.endDate) {
    payload.endDate = formatLocalDateTime(input.endDate);
  }

  const response = await apiClient.patch<ReservationResponse>(
    `/reservations/${reservationId}`,
    payload
  );

  return mapReservation(response.data);
}
