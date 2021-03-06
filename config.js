module.exports = {
	exchange: process.env.EXCHANGE.toLowerCase(),
	binance: {
		APIKEY: process.env.API_KEY,
		APISECRET: process.env.API_SECRET,
		useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
		test: process.env.TEST // If you want to use sandbox mode where orders are simulated
	},
	limits: {
		MAX_STOP_LOSS_PERCENT: 50
	}
};