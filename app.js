require('dotenv').config();
require('./utils/priceListener');
const ee = require('./utils/eventEmiter');
const Trade = require('./utils/trade');


let trade = new Trade({
	market: 'BTCUSDT',
	entry: 1200,
	targets: [7000, 7100, 7200],
	targetsShare: [30, 50, 20],
	amount: 100,
	// stopLoss: 1150,
	stopLossPercent: 5,
	trailing: true
});
trade.start();
setInterval(() => {
	trade.pause();
}, 10000);