import express from 'express';
import { fetchCurrencies } from './service.js';

export const currencyRouter = express.Router();

currencyRouter.get('/', async (req, res) => {
    try{
        const data = await fetchCurrencies();
        res.json({
            isError: false,
            message: '',
            data
        });
    } catch (err){
        res.json({
            isError: true,
            message: err
        });
    }
});