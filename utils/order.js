const binance = require('./binance');

class Order {
	constructor(market) {
		this.market = market;
	};
	marketSell (quantity) {
		binance.marketSell(this.market, quantity);
	};

	marketBuy(quantity) {
		binance.marketBuy(this.market, quantity);
	};

	limitSell(quantity, price) {
		binance.sell(this.market, quantity, price);
	};

	limitBuy(quantity, price) {
		binance.buy(this.market, quantity, price);
	};
}

module.exports = Order;