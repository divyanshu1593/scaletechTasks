import express from 'express';
import dotenv from 'dotenv';
import { convertRouter } from './routes/convert.routes.js';
import { notifyRouter } from './routes/notify.routes.js';
import { currencyRouter } from './routes/currencies.routes.js';
import bodyParser from 'body-parser';
import { notify } from './routes/notify.service.js';
import cors from 'cors';

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT2 || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/convert', convertRouter);
app.use('/api/notify', notifyRouter);
app.use('/api/currencies', currencyRouter);

setInterval(notify, process.env.API_UPDATE_INTERVAL);

app.listen(PORT, () => {
    console.log('server started');
});