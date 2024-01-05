export function validate(username, password){    
    let usernameRegex = /^[a-zA-Z]+[a-zA-Z0-9@\.]{7}$/;
    let hasAlpha = /[a-zA-Z]/;
    let hasNum = /[0-9]/;
    let hasSpecialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!usernameRegex.test(username)){
        return {
            status: 'fail',
            message: 'invalid username'
        }
    }

    if (!hasAlpha.test(password) || !hasNum.test(password) || !hasSpecialChar.test(password) || password.length < 8){
        return {
            status: 'fail',
            message: 'invalid password'
        }
    }

    return ;
}