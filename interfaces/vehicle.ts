export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  modelId?: string;
  year: number;
  imgUrl: string;
  color?: string;
  engineNumber?: string;
  chassisNumber?: string;
  vehicleType?: string;
  transmission?: string;
  fuelType?: string;
}
