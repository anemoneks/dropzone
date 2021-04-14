import { IHouse } from "./i-house";
import { IUser } from "./i-user";

export interface IMessage {
  _id: string;
  allHouses: Boolean;
  houses: IHouse[];
  subject: string;
  body: string;
  unread: Boolean;
  createdBy: IUser;
  createdDate: Date;
  updatedBy: IUser;
  updatedDate: Date;
}
