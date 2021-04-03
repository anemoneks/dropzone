import { IRole } from "../interfaces/i-role";

export class Role implements IRole {
  constructor() {
    this._id = null;
    this.name = null;
  }

  _id: string;
  name: string;
}
