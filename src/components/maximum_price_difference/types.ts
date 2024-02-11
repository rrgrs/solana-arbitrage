import { SolanaExchangePrice } from "@prisma/client";
import { SolanaMaximumPriceDifferenceWithExchangePrices } from "./dao";


export interface CheckCurrPricesAndUpdateMaximumExchangePriceDiffReturn {
    maximumPriceDifference: SolanaMaximumPriceDifferenceWithExchangePrices;
    updated: boolean;
}

export interface MaxMinReturn {
    minExchangePrice: SolanaExchangePrice | null;
    maxExchangePrice: SolanaExchangePrice | null;
}