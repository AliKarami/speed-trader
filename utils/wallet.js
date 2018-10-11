const binance = require('./binance');
const ee = require('./eventEmiter');
const _ = require('underscore');

global.balances = {};

let updateBalances = async () => {
	return new Promise((resolve, reject) => {
		binance.balance(function(error, balances) {
			if (error)
				reject(error);
			else {
				global.balances = balances;
				console.log('wallet updated');
				resolve(balances);
			}
		});
	});
};

let getBalance = (coin) => {
	if (_.isEmpty(global.balances))
		return updateBalances().then(getBalance(coin));
	if (!global.balances[coin])
		throw new Error('Coin is wrong');
	return Number(global.balances[coin].available) + Number(global.balances[coin].onOrder);
};

let getAvailableBalance = (coin) => {
	if (_.isEmpty(global.balances))
		return updateBalances().then(getAvailableBalance(coin));
	if (!global.balances[coin])
		throw new Error('Coin is wrong');
	return Number(global.balances[coin].available);
};


module.exports = {
	updateBalances,
	getBalance,
	getAvailableBalance
};