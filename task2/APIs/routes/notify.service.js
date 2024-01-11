import { client } from '../model/database.js';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

export async function addToDatabase(data){
    const err = await validate(data);
    if (err) return err;

    await client.hSet('currencyConverter:notificationJob:' + crypto.randomUUID(), data);
}

async function validate(data){
    if (data.email == undefined || data.curCode == undefined || data.notifyWhenGoAbove == undefined || data.rate == undefined){
        return {
            isError: true,
            message: 'fields missing'
        }
    }

    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(data.email)){
        return {
            isError: true,
            message: 'invalid email'
        }
    }

    if (data.notifyWhenGoAbove != 'true' && data.notifyWhenGoAbove != 'false'){
        return {
            isError: true,
            message: 'notifyWhenGoAbove have to be boolean'
        }
    }

    if (isNaN(data.rate) || data.rate == Infinity || data.rate == -Infinity){
        return {
            isError: true,
            message: 'rate has to be a finite number'
        }
    }

    const currencyCodes = await (await fetch(`${process.env.API_BASE_URL}/api/currencies.json?app_id=${process.env.APP_ID}`)).json();
    if (!(data.curCode.trim().toUpperCase() in currencyCodes)){
        return {
            isError: true,
            message: "Invalid currency code"
        }
    }
}

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_PROVIDER,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
});

export async function notify(){
    const keys = await client.keys('currencyConverter:notificationJob:*');
    
    for (let key of keys){
        const data = await client.hGetAll(key);
        const need = await needToNotify(data);
        if (need){
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: data.email,
                    subject: 'currency rate notification',
                    text: `The rate of ${data.curCode.trim().toUpperCase()} have gone ${need} ${data.rate}`
                });
                console.log('email sent');
                await client.del(key);
            } catch (err){
                console.log('Email',err);
            }
        }
    }
}



async function needToNotify(data){
    const currentRate = (await (await fetch(`${process.env.API_BASE_URL}/api/latest.json?app_id=${process.env.APP_ID}`)).json())
                        .rates[data.curCode];
    
    if (data.notifyWhenGoAbove == 'true' && currentRate > data.rate) return 'above';
    if (data.notifyWhenGoAbove == 'false' && currentRate < +data.rate) return 'below';
}