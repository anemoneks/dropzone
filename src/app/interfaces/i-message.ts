import { IHouse } from "./i-house";
import { IUser } from "./i-user";

export interface IMessage {
  _id: string;
  house: IHouse;
  subject: string;
  body: string;
  createdBy: IUser;
  createdDate: Date;
  updatedBy: IUser;
  updatedDate: Date;
}
