import request from 'supertest';
import { webserverApp } from '../../applications/webserver';
import { prisma } from '../utils/db';

describe('Email Routes Integration Tests', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE "EmailSubscription" RESTART IDENTITY CASCADE;`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE "EmailSubscription" RESTART IDENTITY CASCADE;`;
    });

    test('POST /email should insert a new email subscription', async () => {
        const response = await request(webserverApp)
            .post('/email-subscriptions')
            .type('form')
            .send({
                emailAddress: 'test@example.com',
                minimumPriceDifferencePercent: 5.0,
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Email subscription successfully created');
    });

    test('POST /email should handle validation errors', async () => {
        const response = await request(webserverApp)
            .post('/email-subscriptions')
            .type('form')
            .send({
                emailAddress: 'invalid-email',
                minimumPriceDifferencePercent: 'not-a-number',
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Error occurred, please try again');
    });

    test('DELETE /email should delete an existing email subscription', async () => {
        const insertResponse = await request(webserverApp)
            .post('/email-subscriptions')
            .type('form')
            .send({
                emailAddress: 'test@example.com',
                minimumPriceDifferencePercent: 5.0,
            });

        const response = await request(webserverApp)
            .delete('/email-subscriptions')
            .type('form')
            .send({
                emailAddress: 'test@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Email subscription successfully deleted');
    });

    test('DELETE /email should handle validation errors', async () => {
        const response = await request(webserverApp)
            .delete('/email-subscriptions')
            .type('form')
            .send({
                emailAddress: 'invalid-email',
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Error occurred, please try again');
    });
});
