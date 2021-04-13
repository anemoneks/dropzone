import { IBill } from "./i-bill";
import { IDocument } from "./i-document";
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
  documents: IDocument[];
}
