import { Maintenance } from "../../interfaces/maintenance";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


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
    id,
    maintenanceName,
    maintenanceImgName,
    maintenanceCategoryName,
    kilometersFrequency,
    recurrencePattern,
  };
}


export async function getMaintenanceByVehicle(
  vehicle_id: string,
): Promise<Maintenance[]> {
  const GET_MAINTENANCES = `${API_URL}/assignedMaintenance/${vehicle_id}`;

  try {
    const response = await fetch(GET_MAINTENANCES);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((maintenance: any) => dataToMaintenance(maintenance));
    
  } catch (error) {
    console.error("Error fetching maintenances:", error);
    throw new Error("Failed to fetch maintenances");
  }
}
