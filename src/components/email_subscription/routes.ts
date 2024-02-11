import express, { Router, Request, Response } from "express";
import { body, matchedData, validationResult } from 'express-validator';
import { insert, remove } from "./dao";

export const emailRouter: Router = express.Router();


emailRouter.post(
    '/',
    body('emailAddress').isEmail().escape(),
    body('minimumPriceDifferencePercent').toFloat(),
    async (req: Request, res: Response) => {
        const validatedReq = validationResult(req);
        if (!validatedReq.isEmpty()) {
            return res.send('Error occurred, please try again');
        }
        const data = matchedData(req);
        const result = await insert(data.emailAddress, data.minimumPriceDifferencePercent);
        res.send('Email subscription successfully created');
    });

emailRouter.delete(
    '/',
    body('emailAddress').notEmpty().isEmail().escape(),
    async (req: Request, res: Response) => {
        const validatedReq = validationResult(req);
        if (!validatedReq.isEmpty()) {
            return res.send('Error occurred, please try again');
        }
        const data = matchedData(req);
        try {
            const result = await remove(data.emailAddress);
            res.send('Email subscription successfully deleted');
            return;
        } catch (e) { }
        res.send('Error occurred, please try again');
    });
