import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchPrices, checkAndUpdatePrices } from './index';
import { ExchangeFetcher, ExchangePrice } from './types';
import { upsert } from './dao';

const mock = new MockAdapter(axios);

jest.mock('./dao', () => ({
  upsert: jest.fn(),
}));

describe('fetchPrices', () => {
  afterEach(() => {
    mock.reset();
  });

  test('fetches prices from exchanges', async () => {
    const exchanges: ExchangeFetcher[] = [
      {
        name: 'Exchange1',
        url: 'https://api.exchange1.com/prices',
        parser: (json: any) => json.price,
      },
    ];

    const expectedExchangePrices: ExchangePrice[] = [
      { exchangeName: 'Exchange1', price: 100.0 },
    ];

    for (let i = 0; i < exchanges.length; i++) {
      const exchange = exchanges[i];
      const expectedPrice = expectedExchangePrices[i];

      mock.onGet(exchange.url).reply(200, { price: expectedPrice.price });

      const result = await fetchPrices([exchange]);

      expect(result).toEqual([expectedPrice]);
    }
  });
});

describe('checkAndUpdatePrices', () => {
  beforeEach(() => {
    (upsert as jest.Mock).mockClear();
  });

  test('should update prices and return changed status', async () => {
    const mockExchangePrices = [
      { exchangeName: 'Exchange1', price: 10 },
      { exchangeName: 'Exchange2', price: 20 },
    ];

    // Mock data for initial prices
    const mockInitialPrices = {
      Exchange1: 5,
      Exchange2: 15,
    };

    const result = await checkAndUpdatePrices(mockInitialPrices, mockExchangePrices);

    expect(upsert).toHaveBeenCalledTimes(2);

    expect(result.changed).toBeTruthy();
    expect(result.prices).toEqual({
      Exchange1: mockExchangePrices[0].price,
      Exchange2: mockExchangePrices[1].price,
    });
  });

  test('should not update prices if they are the same', async () => {
    const mockExchangePrices = [
      { exchangeName: 'Exchange1', price: 5 },
      { exchangeName: 'Exchange2', price: 15 },
    ];

    const mockInitialPrices = {
      Exchange1: 5,
      Exchange2: 15,
    };

    const result = await checkAndUpdatePrices(mockInitialPrices, mockExchangePrices);

    expect(upsert).not.toHaveBeenCalled();

    expect(result.changed).toBeFalsy();
    expect(result.prices).toEqual(mockInitialPrices);
  });
});
