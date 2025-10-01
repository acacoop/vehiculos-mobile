import { Vehicle } from "../interfaces/vehicle";

// Mocked dataset to use when the backend is not available.
// Shape mirrors the API payload keys used by dataToVehicle.
const MOCK_API_VEHICLES = [
  {
  id: "1",
    licenseplate: "ABC123",
    brand: "Toyota",
    model: "Corolla",
    year: 2018,
    imgurl: "",
  engineNumber: "EN-1001",
  chassisNumber: "CH-1001",
  },
  {
  id: "2",
    licenseplate: "DEF456",
    brand: "Ford",
    model: "Focus",
    year: 2019,
    imgurl: "",
  engineNumber: "EN-2002",
  chassisNumber: "CH-2002",
  },
  {
  id: "3",
    licenseplate: "GHI789",
    brand: "Chevrolet",
    model: "Cruze",
    year: 2017,
    imgurl: "",
  engineNumber: "EN-3003",
  chassisNumber: "CH-3003",
  },
  {
  id: "4",
    licenseplate: "JKL012",
    brand: "Volkswagen",
    model: "Golf",
    year: 2020,
    imgurl: "",
  engineNumber: "EN-4004",
  chassisNumber: "CH-4004",
  },
];

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns the full mocked vehicle list after a small delay to simulate network.
 */
export async function getAllVehicles(): Promise<Vehicle[]> {
  await sleep(350);
  return MOCK_API_VEHICLES.map(dataToVehicle);
}

/**
 * Returns a single mocked vehicle by license plate or null if not found.
 */
export async function getVehicle(
  licensePlate: string
): Promise<Vehicle | null> {
  await sleep(150);
  const normalized = (licensePlate || "").toString().trim().toUpperCase();
  const found = MOCK_API_VEHICLES.find(
    (v) => (v.licenseplate || "").toString().toUpperCase() === normalized
  );
  return found ? dataToVehicle(found) : null;
}
