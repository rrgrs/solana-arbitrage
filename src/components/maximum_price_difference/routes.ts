import { Router, Request, Response } from "express";
import { findOne } from "./dao";

export const maximumPriceDifferenceRouter: Router = Router();


maximumPriceDifferenceRouter.get('/', async (req: Request, res: Response) => {
    const maximumPriceDifference = await findOne();
    res.json(maximumPriceDifference);
});
