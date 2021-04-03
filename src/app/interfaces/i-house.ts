import { IBill } from "./i-bill";
import { IPayment } from "./i-payment";
import { IUser } from "./i-user";

export interface IHouse {
  _id: string;
  id: number;
  unit: string;
  street: string;
  users: IUser[];
  bills: IBill[];
  payments: IPayment[];
}
