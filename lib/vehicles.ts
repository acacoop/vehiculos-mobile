import { Vehicle } from "../interfaces/vehicle";
const VEHICLE_SERVER = "http://localhost:3000/vehicles";

function dataToVehicle(data: any): Vehicle {
  const { id, licenseplate: licensePlate, brand, model, year, img } = data;

  return {
    id,
    licensePlate,
    brand,
    model,
    year,
    img,
  };
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const GET_VEHICLES = `${VEHICLE_SERVER}/`;

  try {
    const response = await fetch(GET_VEHICLES);
    const vehicles: Vehicle[] = await response.json();
    const parsedVehicles = vehicles.map(dataToVehicle);
    return parsedVehicles;
  } catch (error) {
    console.error(error);
    return [];
  }
}
