require('dotenv').config();
const binance = require('./utils/binance');

binance.websockets.trades(['BNBBTC', 'ETHBTC'], (trades) => {
	let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
	console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
});