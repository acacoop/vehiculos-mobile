import { Vehicle } from "../interfaces/vehicle";

// Clean service ready to be wired to the real API.
// Next step: replace with actual HTTP calls using your base URL and auth.

export async function getAllVehicles(): Promise<Vehicle[]> {
  // TODO: Implement API call. Returning empty list until connected.
  return [];
}

export async function getVehicle(
  licensePlate: string
): Promise<Vehicle | null> {
  // TODO: Implement API call. Returning null until connected.
  return null;
}
