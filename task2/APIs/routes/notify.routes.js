import express from 'express';
import { addToDatabase } from './notify.service.js';

export const notifyRouter = express.Router();

notifyRouter.post('/', async (req, res) => {
    const data = {
        email: req.body.email,
        curCode: req.body.curCode,
        notifyWhenGoAbove: req.body.notifyWhenGoAbove,
        rate: req.body.rate
    }

    const err = await addToDatabase(data);
    if (err){
        res.json(err);
        return ;
    }

    res.json({
        isError: false,
        message: ''
    });
});