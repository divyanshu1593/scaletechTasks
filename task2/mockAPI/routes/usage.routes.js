import express from 'express';
import { updateUsageObj } from './usage.service.js';

export const usageRouter = express.Router();

usageRouter.get('/', async (req, res) => {
    let usageObj = {
        "status": 200,
        "data": {
          "app_id": "3db44e8c1c1b476c86df8528c376298d",
          "status": "active",
          "plan": {
            "name": "Free",
            "quota": "1000 requests / month",
            "update_frequency": "3600s",
            "features": {
              "base": false,
              "symbols": false,
              "experimental": true,
              "time-series": false,
              "convert": false,
              "bid-ask": false,
              "ohlc": false,
              "spot": false
            }
          },
          "usage": {
            "requests": '',
            "requests_quota": 1000,
            "requests_remaining": '',
            // "days_elapsed": 0,
            // "days_remaining": 31,
            // "daily_average": 3
          }
        }
      }

    let err = await updateUsageObj(usageObj);
    if (err){
        res.json(err);
        return ;
    }

    res.json(usageObj);
});