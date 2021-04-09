import { BillStatus } from './../enums/bill-status.enum'

export interface IBill {
    _id: string;
    houseId: string;
    invoiceNo: string;
    amount: number;
    billMonth: number;
    billYear: number;
    status: BillStatus;
    attachment: string;
    filename: string;
}
