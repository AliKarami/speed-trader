const config = require('../config');
let priceListenerInstance;
switch (config.exchange) {
	case 'binance': {
		priceListenerInstance = require('./binance/binancePriceListener');
		break;
	}
}
module.exports = priceListenerInstance;