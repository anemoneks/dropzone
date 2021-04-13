"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collection = void 0;
const mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});
exports.collection = mongoose.model('VehicleType', schema);
//# sourceMappingURL=vehicleType.js.map