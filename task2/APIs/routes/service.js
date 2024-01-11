import { client } from "../model/database.js";

export async function fetchCurrencies(){
    const reqRemaining = (await (await fetch(`${process.env.API_BASE_URL}/api/usage.json?app_id=${process.env.APP_ID}`)).json())
                            .data.usage.requests_remaining;
    if (reqRemaining <= 0){
        const currencyCodes = await (await fetch(`${process.env.API_BASE_URL2}/latest/currencies.json`)).json();
        console.log('used fallback api for currencies');
        return {
            usedFallback: true,
            currencyCodes
        }
    }

    const lastCached = await client.get('currencyConverter:lastCached:codes');
    if (!lastCached || Date.now() > +lastCached + +process.env.API_UPDATE_INTERVAL){
        const currencyCodes = await (await fetch(`${process.env.API_BASE_URL}/api/currencies.json?app_id=${process.env.APP_ID}`)).json();
        await client.hSet('currencyConverter:cache:codes', currencyCodes);
        await client.set('currencyConverter:lastCached:codes', Date.now());
        console.log('used open exchange rate api for currencies');
        return {
            usedFallback: false,
            currencyCodes
        }
    }
    
    const currencyCodes = await client.hGetAll('currencyConverter:cache:codes');
    console.log('used cached values for currencies');
    return {
        usedFallback: false,
        currencyCodes
    }
}

export async function fetchCurrencyRates(){
    const reqRemaining = (await (await fetch(`${process.env.API_BASE_URL}/api/usage.json?app_id=${process.env.APP_ID}`)).json())
                            .data.usage.requests_remaining;
    if (reqRemaining <= 0){
        const currencyRates = (await (await fetch(`${process.env.API_BASE_URL2}/latest/currencies/usd.json`)).json()).usd;
        console.log('used fallback api for rates');
        return {
            usedFallback: true,
            currencyRates
        }
    }

    const lastCached = await client.get('currencyConverter:lastCached:rates');
    
    if (!lastCached || Date.now() > +lastCached + +process.env.API_UPDATE_INTERVAL){
        const currencyRates = (await (await fetch(`${process.env.API_BASE_URL}/api/latest.json?app_id=${process.env.APP_ID}`)).json()).rates;
        await client.hSet('currencyConverter:cache:rates', currencyRates);
        await client.set('currencyConverter:lastCached:rates', Date.now());
        console.log('used open exchange api for rates');
        return {
            usedFallback: false,
            currencyRates
        }
    }

    const currencyRates = await client.hGetAll('currencyConverter:cache:rates');
    console.log('used cached data for rates');
    return {
        usedFallback: false,
        currencyRates
    }
}