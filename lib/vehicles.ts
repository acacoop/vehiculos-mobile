import { Vehicle } from "../interfaces/vehicle";
const VEHICLE_SERVER = "https://sk9nsqkc-3000.brs.devtunnels.ms/vehicles";

function dataToVehicle(data: any): Vehicle {
  const {
    id,
    licenseplate: licensePlate,
    brand,
    model,
    year,
    imgurl: imgUrl,
  } = data;

  return {
    id,
    licensePlate,
    brand,
    model,
    year,
    imgUrl,
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

export async function getVehicle(licensePlate: string): Promise<Vehicle | null> {
  const GET_VEHICLE = `${VEHICLE_SERVER}/licensePlate/${licensePlate}`;

  try {
    const response = await fetch(GET_VEHICLE);
    const vehicle = await response.json();
    return dataToVehicle(vehicle);
  } catch (error) {
    console.error(error);
    return null;
  }
}