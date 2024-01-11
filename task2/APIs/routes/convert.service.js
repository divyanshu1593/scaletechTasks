import { fetchCurrencies } from "./service.js";
import { fetchCurrencyRates } from "./service.js";

export async function convert(fromCode, fromAmount, toCode){
    fromCode = fromCode.trim().toUpperCase();
    toCode = toCode.trim().toUpperCase();

    let currencyRatesResult;
    let usedFallbackObj;
    do {
        usedFallbackObj = { usedFallback: false }
        const err = await validate(fromCode, fromAmount, toCode, usedFallbackObj);
        if (err) return err;

        currencyRatesResult = await fetchCurrencyRates();
    } while (usedFallbackObj.usedFallback !== currencyRatesResult.usedFallback);

    const toAmount = (+fromAmount / (+currencyRatesResult.currencyRates[fromCode] || +currencyRatesResult.currencyRates[fromCode.toLowerCase()])) * (+currencyRatesResult.currencyRates[toCode] || +currencyRatesResult.currencyRates[toCode.toLowerCase()]);
    
    return {
        isError: false,
        message: '',
        data: {
            toAmount
        }
    }
}

async function validate(fromCode, fromAmount, toCode, fallbackUsedObj){
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

    const currencyCodesResult = await fetchCurrencies();
    if (currencyCodesResult.usedFallback) fallbackUsedObj.usedFallback = true;

    if ((!(fromCode in currencyCodesResult.currencyCodes) && !(fromCode.toLowerCase() in currencyCodesResult.currencyCodes)) || (!(toCode in currencyCodesResult.currencyCodes) && !(toCode.toLowerCase() in currencyCodesResult.currencyCodes))){
        return {
            isError: true,
            message: "Invalid currency code"
        }
    }
}
