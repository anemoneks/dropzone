import { IReceipt } from "../interfaces/i-receipt";

export class Receipt implements IReceipt {
  constructor() {
    this._id = null;
    this.referenceNo = null;
    this.amount = null;
    this.attachment = null;
    this.filename = null;
    this.issuedDate = null;
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
  issuedDate: Date;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}
