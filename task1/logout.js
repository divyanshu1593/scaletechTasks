import express from 'express';

export const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    res.clearCookie('jwtToken');
    res.sendStatus(200);
});