export interface IVisitor {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  documents: string[];
  vehicleNo: string;
  raceId: string;
  houseId: string;
  vehicleTypeId: string;
  purpose: string;
  visitingPurposeId: string;
  visitedDate: Date;
}
