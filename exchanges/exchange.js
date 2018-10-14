const config = require('../config');
let exchangeInstance;
switch (config.exchange) {
	case 'binance': {
		exchangeInstance = require('./binance/binance');
		break;
	}
}
module.exports = exchangeInstance;