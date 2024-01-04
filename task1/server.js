import express from 'express';
import dotenv from 'dotenv';
import { registrationRouter } from './register.js';
import { loginRouter } from './login.js';
import { logoutRouter } from './logout.js';
import { homeRouter } from './home.js';
import bodyParser from 'body-parser';
import { createClient } from 'redis';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const client = createClient();
client.on('error', err => {
    console.log(err);
});
await client.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/register',registrationRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/home', homeRouter);

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server running');
});

app.on('listening', () => {
    console.log('server started');
});

export { client }