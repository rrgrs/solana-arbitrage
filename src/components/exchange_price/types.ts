
export interface ExchangeFetcher {
    name: string;
    url: string;
    parser: (json: any) => number;
}

export interface ExchangePrice {
    exchangeName: string;
    price: number;
}

export interface PricesLookup {
    [exchangeName: string]: number;
}

export interface UpdatedPricesReturn {
    prices: PricesLookup;
    changed: boolean;
}
