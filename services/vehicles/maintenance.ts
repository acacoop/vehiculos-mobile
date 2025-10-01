import { Maintenance } from "../../interfaces/maintenance";

// Mocked maintenances expected by the UI. Keys match the API response format
// so dataToMaintenance can convert them to the app's Maintenance interface.
const MOCK_MAINTENANCES = [
  {
    id: "m1",
    maintenance_name: "Cambio de aceite",
    maintenance_img_name: "aceite.jpg",
    maintenance_category_name: "Preventivo",
    kilometers_frequency: 10000,
    recurrence_pattern: "Cada 10k km",
    vehicle_id: "1",
  },
  {
    id: "m2",
    maintenance_name: "Revisión de frenos",
    maintenance_img_name: "",
    maintenance_category_name: "Preventivo",
    kilometers_frequency: 20000,
    recurrence_pattern: "Cada 20k km",
    vehicle_id: "1",
  },
  {
    id: "m3",
    maintenance_name: "Arreglo del faro",
    maintenance_img_name: "",
    maintenance_category_name: "Correctivo",
    kilometers_frequency: 0,
    recurrence_pattern: "Una vez",
    vehicle_id: "2",
  },
];

function dataToMaintenance(data: any): Maintenance {
  const {
    id,
    maintenance_name: maintenanceName,
    maintenance_img_name: maintenanceImgName,
    maintenance_category_name: maintenanceCategoryName,
    kilometers_frequency: kilometersFrequency,
    recurrence_pattern: recurrencePattern,
  } = data;

  return {
    id: String(id),
    maintenanceName,
    maintenanceImgName,
    maintenanceCategoryName,
    kilometersFrequency,
    recurrencePattern,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMaintenanceByVehicle(
  vehicle_id: string
): Promise<Maintenance[]> {
  // Simulate network latency
  await sleep(250);

  const vid = String(vehicle_id || "");
  const filtered = MOCK_MAINTENANCES.filter(
    (m) => String(m.vehicle_id) === vid
  );
  // If none found for the vehicle, return all preventives as a fallback demo
  const result =
    filtered.length > 0
      ? filtered
      : MOCK_MAINTENANCES.filter(
          (m) => m.maintenance_category_name === "Preventivo"
        );
  return result.map((m) => dataToMaintenance(m));
}

export async function getMaintenanceById(id: string): Promise<Maintenance> {
  await sleep(150);
  const found = MOCK_MAINTENANCES.find((m) => String(m.id) === String(id));
  if (!found) throw new Error("Maintenance not found (mock)");
  return dataToMaintenance(found);
}
