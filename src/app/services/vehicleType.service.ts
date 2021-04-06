import { Observable } from 'rxjs';
import { IVehicleType } from '../interfaces/i-vehicleType';

export abstract class VehicleTypeService {
  vehicleTypesUrl = 'http://localhost:8083/api/vehicleTypes';  // URL to web api

  abstract getVehicleTypes(): Observable<IVehicleType[]>;
  abstract getVehicleType(id: string): Observable<IVehicleType>;
  abstract addVehicleType(vehicleType: IVehicleType): Observable<IVehicleType>;
  abstract deleteVehicleType(vehicleType: IVehicleType | string): Observable<IVehicleType>;
  abstract updateVehicleType(vehicleType: IVehicleType): Observable<IVehicleType>;
}
