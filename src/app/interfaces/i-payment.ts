export interface IPayment {
  _id: string;
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
