import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as methodOverride from 'method-override';
import { api } from './api/routes';
import { api as users } from './api/users';
import { api as houses } from './api/houses';
import { api as bills } from './api/bills';
import { api as payments } from './api/payments';
import { api as receipts } from './api/receipts';
import { api as vehicles } from './api/vehicles';
import { api as roles } from './api/roles';
import { api as visitors } from './api/visitors';
import { api as races } from './api/races';
import { api as vehicleTypes } from './api/vehicleTypes';
import { api as visitingPurposes } from './api/visitingPurposes';
import { api as dashboard } from './api/dashboard';
import { api as documents } from './api/document';

/**
 * MONGO DB INITIALIZATION
 */
dotenv.config();
let connection = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/contentgenerator", { useNewUrlParser: true }).then(
  () => { console.info(`${new Date()} - Connected to MongoDB: ${process.env.MONGODB_URI}`); },
  err => { console.error('MongoDB Connection Error. Please make sure that', process.env.MONGODB_URI, 'is running.'); }
);

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
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/houses', houses);
app.use('/api/bills', bills);
app.use('/api/payments', payments);
app.use('/api/receipts', receipts);
app.use('/api/vehicles', vehicles);
app.use('/api/roles', roles);
app.use('/api/races', races);
app.use('/api/visitors', visitors);
app.use('/api/vehicleTypes', vehicleTypes);
app.use('/api/visitingPurposes', visitingPurposes);
app.use('/api/dashboard', dashboard);
app.use('/api/documents', documents);

/**
 * SERVER INITIALIZATION
 */
const port = process.env.PORT || '8083';
app.set('port', port);
app.listen(port, () => console.log(`Server running on localhost:${port}`));
