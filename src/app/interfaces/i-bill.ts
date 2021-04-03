import { BillStatus } from './../enums/bill-status.enum'

export interface IBill {
    _id: string;
    invoiceNo: string;
    amount: number;
    billMonth: number;
    billYear: number;
    status: BillStatus;
}
