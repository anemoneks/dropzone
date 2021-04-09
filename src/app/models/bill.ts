import { IBill } from "../interfaces/i-bill";
import { BillStatus } from "../enums/bill-status.enum";

export class Bill implements IBill {
    constructor() {
        this._id = null;
        this.houseId = null;
        this.invoiceNo = null;
        this.amount = null;
        this.billMonth = 1;
        this.billYear = (new Date()).getFullYear();
        this.status = BillStatus.Pending;
        this.attachment = null;
        this.filename = null;
    }

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
