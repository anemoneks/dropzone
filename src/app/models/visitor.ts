import { IVisitor } from "../interfaces/i-visitor";

export class Visitor implements IVisitor {
  constructor() {
    this._id = null;
    this.firstName = null;
    this.lastName = null;
    this.gender = null;
    this.documents = [];
  }

  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  documents: string[];
}
