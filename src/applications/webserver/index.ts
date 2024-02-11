import express, { Express, Request, Response } from "express";
import promBundle from "express-prom-bundle";
import { emailRouter } from "../../components/email_subscription/routes";
import { exchangePriceRouter } from "../../components/exchange_price/routes";
import { maximumPriceDifferenceRouter } from "../../components/maximum_price_difference/routes";
import { webserverPort } from "../../env";
import bodyParser from "body-parser";


export const webserverApp: Express = express();

webserverApp.use(promBundle({ includeMethod: true }));
webserverApp.use(express.urlencoded({ extended: true }));
webserverApp.use('/', express.static(process.cwd() + '/public'));

webserverApp.use('/email-subscriptions', emailRouter);
webserverApp.use('/exchange-prices', exchangePriceRouter);
webserverApp.use('/maximum-price-difference', maximumPriceDifferenceRouter);

webserverApp.get('/health', (req: Request, res: Response) => {
    res.send('ok');
});


if (require.main === module) {
    webserverApp.listen(webserverPort, () => {
        console.log(`[server]: Server is running at http://localhost:${webserverPort}`);
    });
}
