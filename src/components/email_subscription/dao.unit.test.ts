import { prismaMock } from '../utils/dbMock';
import { findAllLessThanMinimumPercentThreshold, insert, remove } from './dao';
import '../utils/dbMock';


describe('findAllLessThanMinimumPercentThreshold', () => {
    test('returns email subscriptions with minimumPriceDifferencePercent less than or equal to the given value', async () => {
        const minimumPercent = 5.0;
        const mockEmailSubscriptions = [
            { id: 1, emailAddress: 'email1@example.com', minimumPriceDifferencePercent: 3.0, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, emailAddress: 'email2@example.com', minimumPriceDifferencePercent: 4.5, createdAt: new Date(), updatedAt: new Date() },
        ];

        prismaMock.emailSubscription.findMany.mockResolvedValue(mockEmailSubscriptions);

        const result = await findAllLessThanMinimumPercentThreshold(minimumPercent);

        expect(prismaMock.emailSubscription.findMany).toHaveBeenCalledWith({
            where: {
                minimumPriceDifferencePercent: {
                    lte: minimumPercent,
                },
            },
        });

        expect(result).toEqual(mockEmailSubscriptions);
    });
});

describe('insert', () => {
    test('inserts a new email subscription with the given parameters', async () => {
        const id = 1
        const emailAddress = 'newemail@example.com';
        const minimumPriceDifferencePercent = 2.0;
        const createdAt = new Date();
        const updatedAt = new Date();

        const mockInsertedEmailSubscription = { id, emailAddress, minimumPriceDifferencePercent, createdAt, updatedAt };

        prismaMock.emailSubscription.create.mockResolvedValue(mockInsertedEmailSubscription);

        const result = await insert(emailAddress, minimumPriceDifferencePercent);

        expect(prismaMock.emailSubscription.create).toHaveBeenCalledWith({
            data: { emailAddress, minimumPriceDifferencePercent },
        });

        expect(result).toEqual(mockInsertedEmailSubscription);
    });
});

describe('remove', () => {
    test('deletes an email subscription with the given parameters', async () => {
        const id = 1
        const emailAddressToRemove = 'emailToRemove@example.com';
        const minimumPriceDifferencePercent = 1.5;
        const createdAt = new Date();
        const updatedAt = new Date();
        const mockRemovedEmailSubscription = { id, emailAddress: emailAddressToRemove, minimumPriceDifferencePercent, createdAt, updatedAt };

        prismaMock.emailSubscription.delete.mockResolvedValue(mockRemovedEmailSubscription);

        const result = await remove(emailAddressToRemove);

        expect(prismaMock.emailSubscription.delete).toHaveBeenCalledWith({
            where: { emailAddress: emailAddressToRemove },
        });

        expect(result).toEqual(mockRemovedEmailSubscription);
    });
});

