let init = require('./utils/init');
const ee = require('./utils/eventEmiter');
const Trade = require('./utils/trade');

init().then(()=>{
	try {
		let trade = new Trade({
			market: 'BTCUSDT',
			entry: 44,
			targets: [7000, 7100, 7200],
			targetsShare: [30, 50, 20],
			amount: 1,
			// stopLoss: 1150,
			stopLossPercent: 5,
			trailing: true
		});
		trade.start();
		// setInterval(() => {
		// 	trade.pause();
		// }, 10000);
	} catch (e) {
		console.error(e);
	}
});