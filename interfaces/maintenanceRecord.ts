export interface MaintenanceRecordUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MaintenanceRecord {
  id: string;
  maintenanceId: string;
  vehicleId: string;
  userId: string;
  date: Date;
  kilometers: number;
  notes?: string;
  user?: MaintenanceRecordUser;
}
