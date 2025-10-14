export interface MaintenanceRecord {
  id: string;
  assignedMaintenanceId: string;
  userId: string;
  date: Date;
  kilometers: number;
  notes?: string;
}
