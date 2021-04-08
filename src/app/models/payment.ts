import { IPayment } from "../interfaces/i-payment";

export class Payment implements IPayment {
  constructor() {
    this._id = null;
    this.referenceNo = null;
    this.amount = null;
    this.attachment = null;
    this.filename = null;
    this.paidDate = null;
    this.createdDate = null;
    this.createdBy = null;
    this.updatedDate = null;
    this.updatedBy = null;
    this.houseId = null;
  }
  
  _id: string;
  houseId: string;
  referenceNo: string;
  amount: number;
  attachment: string;
  filename: string;
  paidDate: Date;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}
