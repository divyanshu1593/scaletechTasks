export async function convert(fromCode, fromAmount, toCode){
    fromCode = fromCode.trim().toUpperCase();
    toCode = toCode.trim().toUpperCase();

    let err = await validate(fromCode, fromAmount, toCode);
    if (err) return err;

    const currencyRates = await (await fetch(`${process.env.API_BASE_URL}/api/latest.json?app_id=${process.env.APP_ID}`)).json();
    const toAmount = (+fromAmount / +currencyRates.rates[fromCode]) * +currencyRates.rates[toCode];
    
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

    const currencyCodes = await (await fetch(`${process.env.API_BASE_URL}/api/currencies.json?app_id=${process.env.APP_ID}`)).json();

    if (!(fromCode in currencyCodes) || !(toCode in currencyCodes)){
        return {
            isError: true,
            message: "Invalid currency code"
        }
    }
}
