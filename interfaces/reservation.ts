export interface Reservation {
  id: string;
  vehicleId: string;
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  startDate: Date;
  endDate: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
