import { IHouse } from "../interfaces/i-house";
import { IHousePayment } from "../interfaces/i-house-payment";
import { IPayment } from "../interfaces/i-payment";

export class HousePayment implements IHousePayment {
  constructor() {
    this.house = null;
    this.payment = null;
  }

  house: IHouse;
  payment: IPayment;
}
