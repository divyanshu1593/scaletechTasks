export function validate(req){    
    let usernameRegex = /^[a-zA-Z]+[a-zA-Z0-9@\.]{7}$/;
    let hasAlpha = /[a-zA-Z]/;
    let hasNum = /[0-9]/;
    let hasSpecialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!usernameRegex.test(req.body.username)){
        return {
            status: 'fail',
            message: 'invalid username'
        }
    }

    if (!hasAlpha.test(req.body.password) || !hasNum.test(req.body.password) || !hasSpecialChar.test(req.body.password) || req.body.password.length < 8){
        console.log(!hasAlpha.test(req.body.password));
        console.log(!hasNum.test(req.body.password));
        console.log(!hasSpecialChar.test(req.body.password));
        console.log(req.body.password.length < 8);
        return {
            status: 'fail',
            message: 'invalid password'
        }
    }

    return ;
}