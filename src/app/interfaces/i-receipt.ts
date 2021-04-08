export interface IReceipt {
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
