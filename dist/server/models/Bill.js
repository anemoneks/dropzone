"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true,
    },
    invoiceNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    billMonth: {
        type: Number,
        required: true
    },
    billYear: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
});
exports.Bill = mongoose.model('Bill', schema);
//# sourceMappingURL=Bill.js.map