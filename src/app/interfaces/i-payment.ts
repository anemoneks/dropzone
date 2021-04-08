export interface IPayment {
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
