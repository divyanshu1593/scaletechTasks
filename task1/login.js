import express from 'express';
import bcrypt from 'bcrypt';
import { client } from './server.js';
import jwt from 'jsonwebtoken';
import { validate } from './validation.js';

export const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    let obj = validate(req.body.username, req.body.password);

    if (obj){
        res.json(obj);
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
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24
    });

    res.cookie("jwtToken", token, {
        httpOnly: true,
    });

    res.json({
        status: 'success',
    });
});