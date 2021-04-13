import { IHouse } from "../interfaces/i-house";
import { IBill } from "../interfaces/i-bill";
import { IUser } from "../interfaces/i-user";
import { IPayment } from "../interfaces/i-payment";
import { IDocument } from "../interfaces/i-document";

export class House implements IHouse {
  constructor(house: IHouse = null) {

    this._id = house?._id || null;
    this.id = house?.id || null;
    this.unit = house?.unit || null;
    this.street = house?.street || null;
    this.users = house?.users || [];
    this.bills = house?.bills || [];
    this.payments = house?.payments || [];
    this.documents = house?.documents || [];
  }

  _id: string;
  id: number;
  unit: string;
  street: string;
  users: IUser[];
  bills: IBill[];
  payments: IPayment[];
  documents: IDocument[];

  public address(): string {
    return this.unit + ', ' + this.street;
  }
}
