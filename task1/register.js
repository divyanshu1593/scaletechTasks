import express from 'express';
import { client } from './server.js';
import bcrypt from 'bcrypt';

export const registrationRouter = express.Router();


registrationRouter.post('/', async (req, res) => {
    let usernameRegex = /^[a-zA-Z]+[a-zA-Z0-9@\.]*$/;
    let passwordRegex = /^[a-zA-Z0-9@]*$/;

    if (!usernameRegex.test(req.body.username)){
        res.json({
            status: 'fail',
            message: 'invalid username'
        });
    }

    if (!passwordRegex.test(req.body.password)){
        res.json({
            status: 'fail',
            message: 'invalid password'
        });
    }

    let passwordHash = await bcrypt.hash(req.body.password, 10);
    client.set(req.body.username, passwordHash);

    res.json({
        status: 'success'
    });
});