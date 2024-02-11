import { getChannel } from "../../components/utils/message_queue";
import { ConsumeMessage } from "amqplib";
import { checkCurrPricesAndUpdateMaximumExchangePriceDiff } from "../../components/maximum_price_difference";
import { findAllLessThanMinimumPercentThreshold } from "../../components/email_subscription/dao";
import { EmailMessage } from "../../components/email_subscription/types";
import { emailQueueName, priceCheckerQueueName } from "../../env";


export async function run() {
    console.info('maximum price difference calculator running');
    const channel = await getChannel();
    await channel.consume(priceCheckerQueueName, async (msg: ConsumeMessage | null) => {
        console.info('price change message received')
        if (msg) {
            console.info('processing price change');
            const checkAndUpdateReturn = await checkCurrPricesAndUpdateMaximumExchangePriceDiff();
            if (checkAndUpdateReturn.updated == true) {
                console.info('price update found');
                const {
                    highestExchangePrice: { price: highestPrice, exchangeName: highestPriceExchangeName },
                    lowestExchangePrice: { price: lowestPrice, exchangeName: lowestPriceExchangeName }
                } = checkAndUpdateReturn.maximumPriceDifference
                const percentDifference: number = (highestPrice.toNumber() - lowestPrice.toNumber()) / lowestPrice.toNumber() * 100;
                const emailSubscriptions = await findAllLessThanMinimumPercentThreshold(percentDifference);
                for (const emailSubscription of emailSubscriptions) {
                    const emailBody = `Lowest Price: ${lowestPriceExchangeName} $${lowestPrice}\n` +
                        `Highest Price: ${highestPriceExchangeName} $${highestPrice}\n` +
                        `Percent Difference: ${percentDifference.toFixed(2)}%`;
                    const msg: EmailMessage = {
                        toEmail: emailSubscription.emailAddress,
                        subject: 'Solana Arbitrage Opportunity Detected',
                        body: emailBody,
                    };
                    channel.sendToQueue(emailQueueName, Buffer.from(JSON.stringify(msg)));
                }
            }
            channel.ack(msg);
        }
    });
}


if (require.main === module) {
    run();
}
