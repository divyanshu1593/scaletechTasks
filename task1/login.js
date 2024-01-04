import express from 'express';
import bcrypt from 'bcrypt';
import { client } from './server.js';
import jwt from 'jsonwebtoken';

export const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    let usernameRegex = /^[a-zA-Z]+[a-zA-Z0-9@\.]*$/;
    let passwordRegex = /^[a-zA-Z0-9@_#]*$/;

    if (!usernameRegex.test(req.body.username)){
        res.json({
            status: 'fail',
            message: 'invalid username'
        });
        return ;
    }

    if (!passwordRegex.test(req.body.password)){
        res.json({
            status: 'fail',
            message: 'invalid password'
        });
        return ;
    }

    if (!client.isReady){
        res.json({
            status: 'fail',
            message: 'Database Error'
        });
        return ;
    }

    let passwordHash = await client.get(req.body.username);
    if (passwordHash == null){
        res.json({
            status: 'fail',
            message: 'user not found'
        });
        return ;
    }
    
    let isValid = await bcrypt.compare(req.body.password, passwordHash);
    if (!isValid){
        res.json({
            status: 'fail',
            message: 'password incorrect'
        });
        return ;
    }
    
    let token = jwt.sign({
        user: req.body.username
    }, process.env.JWT_SECRET_KEY);

    res.cookie("token", token);
    res.json({
        status: 'success',
    });
});