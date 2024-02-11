import { Prisma } from '@prisma/client'
import type { SolanaExchangePrice, SolanaMaximumPriceDifference } from '@prisma/client'
import { prisma } from '../utils/db';


export type SolanaMaximumPriceDifferenceWithExchangePrices = Prisma.SolanaMaximumPriceDifferenceGetPayload<{
    include: { highestExchangePrice: true, lowestExchangePrice: true }
}>

export async function findOne(): Promise<SolanaMaximumPriceDifferenceWithExchangePrices> {
    return await prisma.solanaMaximumPriceDifference.findUnique({
        where: { id: 1 },
        include: {
            highestExchangePrice: true,
            lowestExchangePrice: true,
        },
    });
}

export async function upsert(lowestExchangePrice: SolanaExchangePrice, highestExchangePrice: SolanaExchangePrice): Promise<SolanaMaximumPriceDifferenceWithExchangePrices> {
    const { id: highestExchangePriceId, price: currentHighestExchangePrice } = highestExchangePrice;
    const { id: lowestExchangePriceId, price: currentLowestExchangePrice } = lowestExchangePrice;
    return await prisma.solanaMaximumPriceDifference.upsert({
        where: { id: 1 },
        create: { id: 1, highestExchangePriceId, lowestExchangePriceId, currentHighestExchangePrice, currentLowestExchangePrice },
        update: { highestExchangePriceId, lowestExchangePriceId, currentHighestExchangePrice, currentLowestExchangePrice },
        include: {
            highestExchangePrice: true,
            lowestExchangePrice: true,
        },
    });
}