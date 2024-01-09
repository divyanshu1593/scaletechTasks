import express from 'express';
import dotenv from 'dotenv';
import { convertRouter } from './routes/convert.routes.js';
import { notifyRouter } from './routes/notify.routes.js';
import bodyParser from 'body-parser';

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT2 || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/convert', convertRouter);
app.use('/api/notify', notifyRouter);

app.listen(PORT, () => {
    console.log('server started');
});