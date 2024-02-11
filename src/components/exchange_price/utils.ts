import { ExchangePrice, PricesLookup } from "./types";


export function strToDecimal(str: string): number {
    return parseFloat(parseFloat(str).toFixed(2));
};

export function floatToDecimal(flt: number): number {
    return parseFloat(flt.toFixed(2))
}

export function pricesLookupToExchangePrices(pricesLookup: PricesLookup): ExchangePrice[] {
    return Object.keys(pricesLookup).map(key => ({exchangeName: key, price: pricesLookup[key]}));
}