export async function addToDatabase(data){
    const err = await validate(data);
    if (err){
        return err;
    }

    
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

    if (typeof data.notifyWhenGoAbove != 'boolean'){
        return {
            isError: true,
            message: 'notifyWhenGoAbove have to be boolean'
        }
    }

    if (isNaN(data.rate) || rate == Infinity || rate == -Infinity){
        return {
            isError: true,
            message: 'rate has to be a finite number'
        }
    }

    const currencyCodes = await (await fetch(`${process.env.API_BASE_URL}/api/currencies.json?app_id=${process.env.APP_ID}`)).json();

    if (!(data.curCode in currencyCodes)){
        return {
            isError: true,
            message: "Invalid currency code"
        }
    }
}