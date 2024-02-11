import { strToDecimal, floatToDecimal, pricesLookupToExchangePrices } from './utils';

describe('strToDecimal', () => {
  test('converts string to decimal with two decimal places', () => {
    expect(strToDecimal('123.456')).toBe(123.46);
    expect(strToDecimal('7.89')).toBe(7.89);
  });
});

describe('floatToDecimal', () => {
  test('converts float to decimal with two decimal places', () => {
    expect(floatToDecimal(123.456)).toBe(123.46);
    expect(floatToDecimal(7.89)).toBe(7.89);
  });
});

describe('pricesLookupToExchangePrices', () => {
  test('converts PricesLookup to ExchangePrices array', () => {
    const pricesLookup = {
      'Exchange1': 123.45,
      'Exchange2': 67.89,
    };

    const expectedExchangePrices = [
      { exchangeName: 'Exchange1', price: 123.45 },
      { exchangeName: 'Exchange2', price: 67.89 },
    ];

    expect(pricesLookupToExchangePrices(pricesLookup)).toEqual(expectedExchangePrices);
  });
});
