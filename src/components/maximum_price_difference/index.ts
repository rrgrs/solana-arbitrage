import { SolanaExchangePrice } from "@prisma/client";
import { CheckCurrPricesAndUpdateMaximumExchangePriceDiffReturn, MaxMinReturn } from "./types";
import { findOne, upsert } from "./dao";
import { findAll as findAllExhangePrices } from "../exchange_price/dao";


export async function checkCurrPricesAndUpdateMaximumExchangePriceDiff(): Promise<CheckCurrPricesAndUpdateMaximumExchangePriceDiffReturn> {
    const exchangePrices = await findAllExhangePrices();
    const { maxExchangePrice, minExchangePrice } = getMaximumExchangePriceDiff(exchangePrices);
    const maximumPriceDifference = await findOne();
    const checkAndUpdateReturn = { maximumPriceDifference, updated: false };
    if (
        !maximumPriceDifference ||
        maximumPriceDifference.currentHighestExchangePrice != maxExchangePrice.price ||
        maximumPriceDifference.currentLowestExchangePrice != minExchangePrice.price ||
        maximumPriceDifference.highestExchangePriceId != maxExchangePrice.id ||
        maximumPriceDifference.lowestExchangePriceId != minExchangePrice.id
    ) {
        checkAndUpdateReturn.maximumPriceDifference = await upsert(minExchangePrice, maxExchangePrice);
        checkAndUpdateReturn.updated = true;
        return checkAndUpdateReturn;
    }
    return checkAndUpdateReturn;
}

export function getMaximumExchangePriceDiff(exchangePrices: SolanaExchangePrice[]): MaxMinReturn {
    let maxExchangePrice: SolanaExchangePrice = null;
    let minExchangePrice: SolanaExchangePrice = null;
    for (const exchangePrice of exchangePrices) {
        if (maxExchangePrice == null || maxExchangePrice.price.toNumber() < exchangePrice.price.toNumber()) {
            maxExchangePrice = exchangePrice;
        }
        if (minExchangePrice == null || minExchangePrice.price.toNumber() > exchangePrice.price.toNumber()) {
            minExchangePrice = exchangePrice;
        }
    }
    return { minExchangePrice, maxExchangePrice };
}
