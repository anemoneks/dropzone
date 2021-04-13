"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const routes_1 = require("./api/routes");
const users_1 = require("./api/users");
const houses_1 = require("./api/houses");
const bills_1 = require("./api/bills");
const payments_1 = require("./api/payments");
const receipts_1 = require("./api/receipts");
const vehicles_1 = require("./api/vehicles");
const roles_1 = require("./api/roles");
const visitors_1 = require("./api/visitors");
const races_1 = require("./api/races");
const vehicleTypes_1 = require("./api/vehicleTypes");
const visitingPurposes_1 = require("./api/visitingPurposes");
const dashboard_1 = require("./api/dashboard");
const document_1 = require("./api/document");
const messages_1 = require("./api/messages");
/**
 * MONGO DB INITIALIZATION
 */
dotenv.config();
let connection = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/contentgenerator", { useNewUrlParser: true }).then(() => { console.info(`${new Date()} - Connected to MongoDB: ${process.env.MONGODB_URI}`); }, err => { console.error('MongoDB Connection Error. Please make sure that', process.env.MONGODB_URI, 'is running.'); });
/**
 * APP INITIALIZATION
 */
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());
/**
 * APP FILES
 */
app.use(express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/api', routes_1.api);
app.use('/api/users', users_1.api);
app.use('/api/houses', houses_1.api);
app.use('/api/bills', bills_1.api);
app.use('/api/payments', payments_1.api);
app.use('/api/receipts', receipts_1.api);
app.use('/api/vehicles', vehicles_1.api);
app.use('/api/roles', roles_1.api);
app.use('/api/races', races_1.api);
app.use('/api/visitors', visitors_1.api);
app.use('/api/vehicleTypes', vehicleTypes_1.api);
app.use('/api/visitingPurposes', visitingPurposes_1.api);
app.use('/api/dashboard', dashboard_1.api);
app.use('/api/documents', document_1.api);
app.use('/api/messages', messages_1.api);
/**
 * SERVER INITIALIZATION
 */
const port = process.env.PORT || '8083';
app.set('port', port);
app.listen(port, () => console.log(`Server running on localhost:${port}`));
//# sourceMappingURL=server.js.map