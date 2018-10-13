const binance = require('./binance');
const ee = require('./eventEmiter');
const _ = require('underscore');
global.ticker = {};

class PriceListener {
	constructor() {
		this.markets = [];
	}
	async init() {
		return new Promise((resolve, reject) => {
			binance.prevDay(false, (error, prevDay) => {
				if ( error ) reject(error);
				for ( let obj of prevDay ) {
					let symbol = obj.symbol;

					// Filter BTC & USDT markets only (example)
					if ( !symbol.endsWith('BTC') && !symbol.endsWith('USDT') ) continue;

					// console.log(`${symbol} price: ${obj.lastPrice} volume: ${obj.volume} change: ${obj.priceChangePercent}%`);
					global.ticker[symbol] = Number(obj.lastPrice);
					this.markets.push(symbol);
				}
				this.markets = _.uniq(this.markets);
				resolve();
			});
		});
	};
	start() {
		// Subscribe to trades endpoint for all markets
		binance.websockets.trades(this.markets, (trades) => {
			let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades;
			ee.emit(symbol,Number(price));
			global.ticker[symbol] = Number(price);
		});
		ee.emit('price_listener_started');
		console.log('PriceListener started.')
	};
	stop() {
		// List all endpoints
		let endpoints = binance.websockets.subscriptions();
		for ( let endpoint in endpoints ) {
			binance.websockets.terminate(endpoint);
		}
		ee.emit('price_listener_stopped');
		console.log('PriceListener stopped.')
	}
}
const instance = new PriceListener();

module.exports = instance;