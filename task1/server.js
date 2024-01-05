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

// const client = createClient();
// await client.connect();
// client.on('error', err => {
//     console.log(err);
// });
// await client.connect();

// async function func(){
//     try {
        
//     } catch {
//         await func();
//     }
//     console.log('here');
// }

// await func();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(async (req, res, next) => {
//     if (!client){
//         client = createClient();
//         client.on('error', err => {
//             console.log(err);
//         });
//         await client.connect();
//     }

//     if (!client.isReady){
//         if (client.isOpen) client.disconnect();
//         client.connect();
//     }

//     next();
// });
app.use('/register',registrationRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/home', homeRouter);

let client;
let PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    let startTime;
    let temp;
    let flag = false;
    client = createClient({
        socket: {
            reconnectStrategy: retryNum => {
                // if (retryNum < 7) return 1000 * 2 **(retryNum + 1);
                // return 1000 * 60;
                if (retryNum == 0){
                    startTime = Date.now();
                }
                
                if (Date.now() > startTime + 1000 * 5){
                    if (!flag){
                        temp = retryNum;
                        flag = true;
                    }

                    if (retryNum - temp < 7) return 1000 * 2 ** (retryNum - temp);
                    return 1000 * 60;
                }

                return 0;
            }
        }
    });
    client.on('error', err => {
        console.log(err);
    });
    await client.connect();
    console.log('server running');
});

app.on('listening', () => {
    console.log('server started');
});

export { client }