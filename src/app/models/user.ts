import { IUser } from "../interfaces/i-user";
import { IRole } from "../interfaces/i-role";

export class User implements IUser {
  constructor() {
    this._id = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.username = null;
    this.password = null;
    this.confirmPassword = null;
    this.roles = [];
    this.avatar = null;
  }

  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  roles: IRole[];
  avatar: object;
}
