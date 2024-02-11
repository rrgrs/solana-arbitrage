import axios from 'axios';
import { ExchangeFetcher, ExchangePrice, PricesLookup, UpdatedPricesReturn } from './types';
import { floatToDecimal, strToDecimal } from './utils';
import { upsert } from './dao';


export let exchangePriceFetchers: ExchangeFetcher[] = [
    {
        'name': 'Binance',
        'url': 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
        'parser': json => strToDecimal(json['price']),
    },
    {
        'name': 'Coinbase',
        'url': 'https://api.coinbase.com/v2/prices/SOL-USD/spot',
        'parser': json => strToDecimal(json['data']['amount']),
    },
    {
        'name': 'Kraken',
        'url': 'https://api.kraken.com/0/public/Ticker?pair=SOLUSDT',
        'parser': json => strToDecimal(json['result']['SOLUSDT']['a'][0]),
    },
    {
        'name': 'Gemini',
        'url': 'https://api.gemini.com/v1/pubticker/solusd',
        'parser': json => strToDecimal(json['last']),
    },
    {
        'name': 'Bitfinex',
        'url': 'https://api-pub.bitfinex.com/v2/ticker/tSOLUSD',
        'parser': json => strToDecimal(json[0]),
    },
    {
        'name': 'Huobi',
        'url': 'https://api.huobi.pro/market/detail/merged?symbol=solusdt',
        'parser': json => floatToDecimal((parseFloat(json['tick']['bid'][0]) + parseFloat(json['tick']['ask'][0])) / 2),
    },
    {
        'name': 'OKEx',
        'url': 'https://www.okx.com/api/v5/market/ticker?instId=SOL-USDT-SWAP',
        'parser': json => floatToDecimal((parseFloat(json['data'][0]['askPx']) + parseFloat(json['data'][0]['bidPx'])) / 2),
    },
    {
        'name': 'Gate.io',
        'url': 'https://api.gateio.ws/api/v4/spot/tickers?currency_pair=SOL_USDT',
        'parser': json => floatToDecimal((parseFloat(json[0]['lowest_ask']) + parseFloat(json[0]['highest_bid'])) / 2),
    },
    {
        'name': 'BitForex',
        'url': 'https://api.bitforex.com/api/v1/market/ticker?symbol=coin-usdt-sol',
        'parser': json => floatToDecimal((parseFloat(json['data']['buy']) + parseFloat(json['data']['sell'])) / 2),
    },
    {
        'name': 'CoinEx',
        'url': 'https://api.coinex.com/v1/market/ticker?market=solusdt',
        'parser': json => floatToDecimal((parseFloat(json['data']['ticker']['buy']) + parseFloat(json['data']['ticker']['sell'])) / 2),
    },
    {
        'name': 'BitMax',
        'url': 'https://bitmax.io/api/pro/v1/ticker?symbol=SOL/USDT',
        'parser': json => floatToDecimal((parseFloat(json['data']['ask'][0]) + parseFloat(json['data']['bid'][0])) / 2),
    },
];


export async function fetchPrices(exchanges: ExchangeFetcher[]): Promise<ExchangePrice[]> {
    let exchangePrices: ExchangePrice[] = [];
    for (let exchange of exchanges) {
        let resp = null;
        for (let i of Array(3).keys()) {
            try {
                resp = await axios.get(exchange.url);
                break;
            } catch (error) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (resp == null) {
            console.error(`exchange ${exchange.name} with url ${exchange.url} return an empty response`);
            continue;
        }
        let price: number = null;
        try {
            price = exchange.parser(resp.data);
        } catch (error) {
            console.error(error.toString());
            continue;
        }
        exchangePrices.push({ exchangeName: exchange.name, price });
    }
    return exchangePrices;
}

export async function checkAndUpdatePrices(currentPrices: PricesLookup, updatedPrices: ExchangePrice[]): Promise<UpdatedPricesReturn> {
    let changed: boolean = false;
    for (let updatedPrice of updatedPrices) {
        const currentPrice = currentPrices[updatedPrice.exchangeName]
        if (currentPrice != updatedPrice.price) {
            await upsert(updatedPrice.exchangeName, updatedPrice.price);
            currentPrices[updatedPrice.exchangeName] = updatedPrice.price;
            changed = true;
        }
    }
    return { prices: currentPrices, changed }
}
