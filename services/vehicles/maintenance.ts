import { Maintenance } from "../../interfaces/maintenance";

// Clean service ready for real API integration.

export async function getMaintenanceByVehicle(
  vehicle_id: string
): Promise<Maintenance[]> {
  // TODO: Implement API call. Returning empty list until connected.
  return [];
}

export async function getMaintenanceById(id: string): Promise<Maintenance> {
  // TODO: Implement API call. Throw until connected to catch improper usage.
  throw new Error("getMaintenanceById not implemented");
}
