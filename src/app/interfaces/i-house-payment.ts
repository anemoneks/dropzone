import { IHouse } from "./i-house";
import { IPayment } from "./i-payment";

export interface IHousePayment {
  house: IHouse;
  payment: IPayment;
}
