import express from 'express';
import dotenv from 'dotenv';
import { registrationRouter } from './register.js';
import { loginRouter } from './login.js';
import { adminRouter } from './admin.js';
import bodyParser from 'body-parser';
import { createClient } from 'redis';

export const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/register',registrationRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);

dotenv.config();

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server running');
});