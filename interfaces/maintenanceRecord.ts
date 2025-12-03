export interface MaintenanceRecord {
  id: string;
  maintenanceId: string;
  vehicleId: string;
  userId: string;
  date: Date;
  kilometers: number;
  notes?: string;
}
