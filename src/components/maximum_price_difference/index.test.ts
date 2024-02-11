import { Prisma } from '@prisma/client';
import { getMaximumExchangePriceDiff, checkCurrPricesAndUpdateMaximumExchangePriceDiff } from './index';
import { MaxMinReturn } from './types';
import { findOne, upsert } from './dao';
import { findAll as findAllExhangePrices } from "../exchange_price/dao";


jest.mock('./dao', () => ({
  findOne: jest.fn(),
  upsert: jest.fn(),
}));

jest.mock('../exchange_price/dao', () => ({
  findAllExhangePrices: jest.fn(),
  findAll: jest.fn(),
}));

describe('checkCurrPricesAndUpdateMaximumExchangePriceDiff', () => {
  beforeEach(() => {
    (findAllExhangePrices as jest.Mock).mockClear();
    (findOne as jest.Mock).mockClear();
    (upsert as jest.Mock).mockClear();
  });

  test('should update maximum price difference when values differ', async () => {
    const mockMaxExchangePrice = { id: 2, price: new Prisma.Decimal(20) };
    const mockMinExchangePrice = { id: 1, price: new Prisma.Decimal(10) };
    const mockExchangePrices = [mockMinExchangePrice, mockMaxExchangePrice];
    const mockMaximumPriceDifference = {
      currentHighestExchangePrice: 15,
      currentLowestExchangePrice: 5,
      highestExchangePriceId: 2,
      lowestExchangePriceId: 1,
    };
    const mockUpdatedMaximumPriceDifference = {
      currentHighestExchangePrice: mockMaxExchangePrice.price,
      currentLowestExchangePrice: mockMinExchangePrice.price,
      highestExchangePriceId: mockMaxExchangePrice.id,
      lowestExchangePriceId: mockMinExchangePrice.id,
      highestExchangePrice: mockMaxExchangePrice,
      lowestExchangePrice: mockMinExchangePrice,
    };

    (findAllExhangePrices as jest.Mock).mockResolvedValue(mockExchangePrices);
    (findOne as jest.Mock).mockResolvedValue(mockMaximumPriceDifference);
    (upsert as jest.Mock).mockResolvedValue(mockUpdatedMaximumPriceDifference);

    const result = await checkCurrPricesAndUpdateMaximumExchangePriceDiff();

    expect(findAllExhangePrices).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(mockMinExchangePrice, mockMaxExchangePrice);

    expect(result.updated).toBeTruthy();
    expect(result.maximumPriceDifference).toEqual(mockUpdatedMaximumPriceDifference);
  });
});


describe('getMaximumExchangePriceDiff', () => {
  test('returns the minimum and maximum exchange prices correctly', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const exchangePrices = [
      { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt, updatedAt },
      { id: 2, exchangeName: 'Exchange2', price: new Prisma.Decimal(150.0), createdAt, updatedAt },
      { id: 3, exchangeName: 'Exchange3', price: new Prisma.Decimal(120.0), createdAt, updatedAt },
      { id: 4, exchangeName: 'Exchange4', price: new Prisma.Decimal(130.0), createdAt, updatedAt },
    ];

    const expectedResult: MaxMinReturn = {
      minExchangePrice: { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt, updatedAt },
      maxExchangePrice: { id: 2, exchangeName: 'Exchange2', price: new Prisma.Decimal(150.0), createdAt, updatedAt },
    };

    const result = getMaximumExchangePriceDiff(exchangePrices);

    expect(result).toEqual(expectedResult);
  });

  test('handles empty array input', () => {
    const exchangePrices: any[] = [];

    const expectedResult: MaxMinReturn = {
      minExchangePrice: null,
      maxExchangePrice: null,
    };

    const result = getMaximumExchangePriceDiff(exchangePrices);

    expect(result).toEqual(expectedResult);
  });

  test('handles array with a single element', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const exchangePrice = { id: 1, exchangeName: 'Exchange1', price: new Prisma.Decimal(100.0), createdAt, updatedAt };
    const exchangePrices = [exchangePrice];

    const expectedResult: MaxMinReturn = {
      minExchangePrice: exchangePrice,
      maxExchangePrice: exchangePrice,
    };

    const result = getMaximumExchangePriceDiff(exchangePrices);

    expect(result).toEqual(expectedResult);
  });
});
