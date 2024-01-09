import express from 'express';
import { client } from '../model/database.js'

export const notifyRouter = express.Router();

notifyRouter.post('/', async (req, res) => {
    const data = {
        email: req.body.email,
        curCode: req.body.curCode,
        notifyWhenGoAbove: req.body.notifyWhenGoAbove,
        rate: req.body.rate
    }

    // await client.hSet('currencyNotify:' + crypto.randomUUID(), data);
});