import request from 'supertest';
import { prisma } from '../utils/db';
import { webserverApp } from '../../applications/webserver';
import { upsert } from '../exchange_price/dao';


describe('SolanaExchangePrice Routes Integration Tests', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE "SolanaExchangePrice" RESTART IDENTITY CASCADE;`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE "SolanaExchangePrice" RESTART IDENTITY CASCADE;`;
    });

    test('GET /maximumPriceDifference should return the maximum price difference', async () => {
        await upsert('Exchange1', 100.00);
        await upsert('Exchange2', 150.00);

        const response = await request(webserverApp).get('/exchange-prices');

        expect(response.status).toBe(200);
        expect(response.body[0]).toMatchObject({ id: 1, exchangeName: 'Exchange1', price: '100' });
        expect(response.body[1]).toMatchObject({ id: 2, exchangeName: 'Exchange2', price: '150' });
    });

});