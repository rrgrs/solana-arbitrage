import request from 'supertest';
import { prisma } from '../utils/db';
import { webserverApp } from '../../applications/webserver';
import { upsert as upsertExchangePrice } from '../exchange_price/dao';
import { upsert } from './dao';


describe('MaximumPriceDifference Routes Integration Tests', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE "SolanaMaximumPriceDifference" RESTART IDENTITY CASCADE;`;
        await prisma.$executeRaw`TRUNCATE "SolanaExchangePrice" RESTART IDENTITY CASCADE;`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE "SolanaMaximumPriceDifference" RESTART IDENTITY CASCADE;`;
        await prisma.$executeRaw`TRUNCATE "SolanaExchangePrice" RESTART IDENTITY CASCADE;`;
    });

    test('GET /maximum-price-difference should return the maximum price difference', async () => {
        const exchangePrice1 = await upsertExchangePrice('Exchange1', 100.00);
        const exchangePrice2 = await upsertExchangePrice('Exchange2', 150.00);
        await upsert(exchangePrice1, exchangePrice2);

        const response = await request(webserverApp).get('/maximum-price-difference');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

});