import type { SolanaExchangePrice } from '@prisma/client'
import { prisma } from '../utils/db';


export function findAll(): Promise<SolanaExchangePrice[]> {
    return prisma.solanaExchangePrice.findMany({ orderBy: { exchangeName: 'asc' } });
}

export function upsert(exchangeName: string, price: number): Promise<SolanaExchangePrice> {
    return prisma.solanaExchangePrice.upsert({
        where: { exchangeName },
        create: { exchangeName, price },
        update: { price },
    });
}
