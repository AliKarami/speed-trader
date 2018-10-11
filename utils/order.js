const binance = require('./binance');

function Order(market) {
	this.market = market;
	this.marketSell = (quantity) => {
		binance.marketSell(this.market, quantity);
	};

	this.marketBuy = (quantity) => {
		binance.marketBuy(this.market, quantity);
	};

	this.limitSell = (quantity, price) => {
		binance.sell(this.market, quantity, price);
	};

	this.limitBuy = (quantity, price) => {
		binance.buy(this.market, quantity, price);
	};
}

module.exports = Order;