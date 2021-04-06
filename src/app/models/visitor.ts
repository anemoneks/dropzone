import { IHouse } from "../interfaces/i-house";
import { IVisitor } from "../interfaces/i-visitor";

export class Visitor implements IVisitor {
  constructor() {
    this._id = null;
    this.firstName = null;
    this.lastName = null;
    this.gender = null;
    this.documents = [];
    this.vehicleNo = null;
    this.houseId = null;
    this.raceId = null;
    this.vehicleTypeId = null;
    this.visitingPurposeId = null;
    this.visitedDate = null;
  }

  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  documents: string[];
  vehicleNo: string;
  houseId: string;
  raceId: string;
  vehicleTypeId: string;
  purpose: string;
  visitingPurposeId: string;
  visitedDate: Date;
}
