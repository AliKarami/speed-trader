const binance = require('./binance');
const ee = require('./eventEmiter');
global.ticker = {};

class PriceListener {
	constructor() {
		this.markets = [];
		binance.prevDay(false, (error, prevDay) => {
			if ( error ) throw error;
			for ( let obj of prevDay ) {
				let symbol = obj.symbol;

				// Filter BTC & USDT markets only (example)
				if ( !symbol.endsWith('BTC') && !symbol.endsWith('USDT') ) continue;

				// console.log(`${symbol} price: ${obj.lastPrice} volume: ${obj.volume} change: ${obj.priceChangePercent}%`);
				global.ticker[symbol] = obj.lastPrice;
				this.markets.push(symbol);
			}
		});
	}
	start() {
		// Subscribe to trades endpoint for all markets
		binance.websockets.trades(this.markets, (trades) => {
			let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades;
			ee.emit(symbol,price);
			global.ticker[symbol] = price;
		});
		ee.emit('price_listener_started');
		console.log('PriceListener started.')
	};
}

const instance = new PriceListener();

module.exports = instance;