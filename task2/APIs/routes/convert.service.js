import { client } from "../model/database.js";

export async function convert(fromCode, fromAmount, toCode){
    fromCode = fromCode.trim().toUpperCase();
    toCode = toCode.trim().toUpperCase();

    let err = await validate(fromCode, fromAmount, toCode);
    if (err) return err;

    const lastCached = await client.get('currencyConverter:lastCached:rates');
    let currencyRates;
    if (!lastCached || Date.now() > +lastCached + +process.env.API_UPDATE_INTERVAL){
        currencyRates = (await (await fetch(`${process.env.API_BASE_URL}/api/latest.json?app_id=${process.env.APP_ID}`)).json()).rates;
        await client.hSet('currencyConverter:cache:rates', currencyRates);
        await client.set('currencyConverter:lastCached:rates', Date.now());
        console.log('called API for latest');
    } else {
        currencyRates = await client.hGetAll('currencyConverter:cache:rates');
        console.log('used cached data for latest');
    }

    const toAmount = (+fromAmount / +currencyRates[fromCode]) * +currencyRates[toCode];
    
    return {
        isError: false,
        message: '',
        data: {
            toAmount
        }
    }
}

async function validate(fromCode, fromAmount, toCode){
    if (!fromCode || !toCode || fromAmount == undefined){
        return {
            isError: true,
            message: "parameter missing"
        }
    }

    if (isNaN(fromAmount) || fromAmount == Infinity || fromAmount == -Infinity){
        return {
            isError: true,
            message: "invalid amount"
        }
    }

    const lastCached = await client.get('currencyConverter:lastCached:codes');
    let currencyCodes;
    if (!lastCached || Date.now() > +lastCached + +process.env.API_UPDATE_INTERVAL){
        currencyCodes = await (await fetch(`${process.env.API_BASE_URL}/api/currencies.json?app_id=${process.env.APP_ID}`)).json();
        await client.hSet('currencyConverter:cache:codes', currencyCodes);
        await client.set('currencyConverter:lastCached:codes', Date.now());
        console.log('called API for currencies');
    } else {
        currencyCodes = await client.hGetAll('currencyConverter:cache:codes');
        console.log('used cached currencies');
    }

    if (!(fromCode in currencyCodes) || !(toCode in currencyCodes)){
        return {
            isError: true,
            message: "Invalid currency code"
        }
    }
}
