import { IVehicleType } from "../interfaces/i-vehicleType";

export class VehicleType implements IVehicleType {
  constructor(vehicleType: IVehicleType = null) {
    this._id = vehicleType._id || null;
    this.name = vehicleType.name || null;
  }

  _id: string;
  name: string;
}
