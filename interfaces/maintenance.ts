export interface Maintenance {
  id: string;
  maintenanceId: string;
  maintenanceName: string;
  maintenanceImgName: string;
  maintenanceCategoryName: string;
  kilometersFrequency: number;
  daysFrequency?: number | null;
  recurrencePattern: string;
}
