import { Router, Request, Response } from "express";
import { findAll } from "./dao";

export const exchangePriceRouter: Router = Router();


exchangePriceRouter.get('/', async (req: Request, res: Response) => {
    const solanaExchangePrices = await findAll();
    res.json(solanaExchangePrices);
});
