import { prismaMock } from '../utils/dbMock';
import { findAll, upsert } from './dao';
import { Prisma } from '@prisma/client';
import '../utils/dbMock';


describe('findAll', () => {
    test('returns all SolanaExchangePrices in ascending order', async () => {
        const mockSolanaExchangePrices = [
            { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt: new Date(), updatedAt: new Date() },
            { id: 2, exchangeName: 'Exchange2', price: new Prisma.Decimal(200.0), createdAt: new Date(), updatedAt: new Date() },
        ];

        prismaMock.solanaExchangePrice.findMany.mockResolvedValue(mockSolanaExchangePrices);

        const result = await findAll();

        expect(prismaMock.solanaExchangePrice.findMany).toHaveBeenCalledWith({
            orderBy: { exchangeName: 'asc' },
        });

        expect(result).toEqual(mockSolanaExchangePrices);
    });
});

describe('upsert', () => {
    test('creates or updates SolanaExchangePrice with the given exchangeName and price', async () => {
        const exchangeName = 'Exchange1';
        const price = 150.0;

        const mockUpsertedSolanaExchangePrice = { id: 1, exchangeName, price: new Prisma.Decimal(price), createdAt: new Date(), updatedAt: new Date() };

        prismaMock.solanaExchangePrice.upsert.mockResolvedValue(mockUpsertedSolanaExchangePrice);

        const result = await upsert(exchangeName, price);

        expect(prismaMock.solanaExchangePrice.upsert).toHaveBeenCalledWith({
            where: { exchangeName },
            create: { exchangeName, price },
            update: { price },
        });

        expect(result).toEqual(mockUpsertedSolanaExchangePrice);
    });
});