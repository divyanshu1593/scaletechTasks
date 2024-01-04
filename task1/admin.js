import express from 'express';
import jwt from 'jsonwebtoken';

export const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    
    try{
        let userObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.send(`Welcome ${userObj.user}`);
    } catch {
        res.send('NOT Authorized!');
    }
});