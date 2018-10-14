const exchange = require('../exchanges/exchange');

class Order {
	constructor(market) {
		this.market = market;
	};
	marketSell (quantity) {
		exchange.marketSell(this.market, quantity);
	};

	marketBuy(quantity) {
		exchange.marketBuy(this.market, quantity);
	};

	limitSell(quantity, price) {
		exchange.sell(this.market, quantity, price);
	};

	limitBuy(quantity, price) {
		exchange.buy(this.market, quantity, price);
	};
}

module.exports = Order;