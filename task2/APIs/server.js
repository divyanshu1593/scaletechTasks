import express from 'express';
import dotenv from 'dotenv';
import { convertRouter } from './routes/convert.routes.js';
import { notifyRouter } from './routes/notify.routes.js';
import bodyParser from 'body-parser';
import { notify } from './routes/notify.service.js';

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT2 || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/convert', convertRouter);
app.use('/api/notify', notifyRouter);

setInterval(notify, 1000 * 60 * 60);

app.listen(PORT, () => {
    console.log('server started');
});