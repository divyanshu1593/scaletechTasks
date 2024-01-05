import express from 'express';
import { client } from './server.js';
import bcrypt from 'bcrypt';
import { validate } from './validation.js';

export const registrationRouter = express.Router();


registrationRouter.post('/', async (req, res) => {
    let obj = validate(req.body.username, req.body.password);

    if (obj){
        res.json(obj);
        return ;
    }

    let passwordHash = await bcrypt.hash(req.body.password, 10);
    if (!client.isReady){
        res.json({
            status: 'fail',
            message: 'Database Error'
        });

        return ;
    }

    if (await client.get(req.body.username) != null){
        res.json({
            status: 'fail',
            message: 'username already taken'
        });
        return ;
    }
    
    client.set(req.body.username, passwordHash);
    res.json({
        status: 'success'
    });
});