import express from "express";
import { convert } from "./convert.service.js";

export const convertRouter = express.Router();

convertRouter.get('/', async (req, res) => {
    const result = await convert(req.query.fromCode, req.query.fromAmount, req.query.toCode);
    res.json(result);
});