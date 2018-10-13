let init = require('./utils/init');
const Trade = require('./utils/trade');

init().then(()=>{
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
	return trade.start();
}).then(()=>{
	// setTimeout(() => {
	// 	trade.pause();
	// }, 60000);
}).catch((e)=>{
	console.error(e);
});