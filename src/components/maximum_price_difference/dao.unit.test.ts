import { prismaMock } from '../utils/dbMock';
import { findOne, upsert } from './dao';
import { Prisma } from '@prisma/client';
import '../utils/dbMock';


describe('findOne', () => {
    test('returns SolanaMaximumPriceDifference with included highest and lowest exchange prices', async () => {
        const highestExchangePrice = { id: 2, exchangeName: 'Exchange2', price: new Prisma.Decimal(200.0), createdAt: new Date(), updatedAt: new Date() };
        const lowestExchangePrice = { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt: new Date(), updatedAt: new Date() };

        const mockSolanaMaximumPriceDifference = {
            id: 1,
            highestExchangePriceId: highestExchangePrice.id,
            currentHighestExchangePrice: highestExchangePrice.price,
            highestExchangePrice,
            lowestExchangePriceId: lowestExchangePrice.id,
            currentLowestExchangePrice: lowestExchangePrice.price,
            lowestExchangePrice,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        prismaMock.solanaMaximumPriceDifference.findUnique.mockResolvedValue(mockSolanaMaximumPriceDifference);

        const result = await findOne();

        expect(prismaMock.solanaMaximumPriceDifference.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: {
                highestExchangePrice: true,
                lowestExchangePrice: true,
            },
        });

        expect(result).toEqual(mockSolanaMaximumPriceDifference);
    });
});

describe('upsert', () => {
    test('upserts SolanaMaximumPriceDifference with given lowest and highest exchange prices', async () => {
        const lowestExchangePrice = { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt: new Date(), updatedAt: new Date() };
        const highestExchangePrice = { id: 2, exchangeName: 'Exchange2', price: new Prisma.Decimal(200.0), createdAt: new Date(), updatedAt: new Date() };

        const mockUpsertedSolanaMaximumPriceDifference = {
            id: 1,
            highestExchangePriceId: highestExchangePrice.id,
            lowestExchangePriceId: lowestExchangePrice.id,
            currentHighestExchangePrice: highestExchangePrice.price,
            currentLowestExchangePrice: lowestExchangePrice.price,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        prismaMock.solanaMaximumPriceDifference.upsert.mockResolvedValue(mockUpsertedSolanaMaximumPriceDifference);

        const result = await upsert(lowestExchangePrice, highestExchangePrice);

        expect(prismaMock.solanaMaximumPriceDifference.upsert).toHaveBeenCalledWith({
            where: { id: 1 },
            create: {
                id: 1,
                highestExchangePriceId: highestExchangePrice.id,
                lowestExchangePriceId: lowestExchangePrice.id,
                currentHighestExchangePrice: highestExchangePrice.price,
                currentLowestExchangePrice: lowestExchangePrice.price,
            },
            update: {
                highestExchangePriceId: highestExchangePrice.id,
                lowestExchangePriceId: lowestExchangePrice.id,
                currentHighestExchangePrice: highestExchangePrice.price,
                currentLowestExchangePrice: lowestExchangePrice.price,
            },
            include: {
                highestExchangePrice: true,
                lowestExchangePrice: true,
            },
        });

        expect(result).toEqual(mockUpsertedSolanaMaximumPriceDifference);
    });
});