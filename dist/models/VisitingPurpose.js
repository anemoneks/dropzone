"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitingPurpose = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
});
exports.VisitingPurpose = mongoose.model('VisitingPurpose', schema);
//# sourceMappingURL=VisitingPurpose.js.map