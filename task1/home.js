import express from 'express';
import jwt from 'jsonwebtoken';

export const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    let token = req.cookies.jwtToken;

    try {
        let userObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.send(`Welcome ${userObj.user}`);
    } catch {
        res.send('Token Expired!');
    }
});