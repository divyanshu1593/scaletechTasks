import express from 'express';
import dotenv from 'dotenv';
import { latestRouter } from './routes/latest.routes.js';
import { currenciesRouter } from './routes/currencies.routes.js';
import { usageRouter } from './routes/usage.routes.js';

dotenv.config({path: '../.env'});
const app = express();
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
    if (!req.query.app_id){
        res.json({
            "error": true,
            "status": 403,
            "message": "missing_app_id",
            "description": "No App ID provided. Please sign up at https://openexchangerates.org/signup, or contact support@openexchangerates.org."
        });
        return ;
    }

    if (req.query.app_id != process.env.APP_ID){
        res.json({
            "error": true,
            "status": 401,
            "message": "invalid_app_id",
            "description": "Invalid App ID provided. Please sign up at https://openexchangerates.org/signup, or contact support@openexchangerates.org."
        });
        return ;
    }

    next();
});
app.use('/api/latest.json', latestRouter);
app.use('/api/currencies.json', currenciesRouter);
app.use('/api/usage.json', usageRouter);

app.listen(PORT, () => {
    console.log('Server started');
});