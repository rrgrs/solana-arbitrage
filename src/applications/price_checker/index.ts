import { checkAndUpdatePrices, exchangePriceFetchers, fetchPrices } from "../../components/exchange_price";
import { findAll } from "../../components/exchange_price/dao";
import { getChannel } from "../../components/utils/message_queue";
import { PricesLookup } from "../../components/exchange_price/types";
import { priceCheckerQueueName } from "../../env";


async function run() {
    console.info('starting price checker')
    const initialPrices = await findAll();
    let currPrices: PricesLookup = initialPrices.reduce((acc, price) => ({ ...acc, [price.exchangeName]: price.price }), {});
    const channel = await getChannel();
    await channel.assertQueue(priceCheckerQueueName);
    while (true) {
        console.info('fetching prices');
        const updatedPrices = await fetchPrices(exchangePriceFetchers);
        const { changed, prices } = await checkAndUpdatePrices(currPrices, updatedPrices);
        currPrices = prices;
        if (changed == true) {
            console.info('price change found')
            channel.sendToQueue(priceCheckerQueueName, Buffer.from(JSON.stringify(prices)));
        }
        console.info('waiting');
        await new Promise(r => setTimeout(r, 30 * 1000));
    }
}

if (require.main === module) {
    run();
}
