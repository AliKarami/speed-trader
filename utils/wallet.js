const binance = require('./binance');
const ee = require('./eventEmiter');
const _ = require('underscore');

global.balances = {};

class Wallet {
	//******************************************* fields ************************************************
	constructor() {
		this.balances = {};
		this.init();
	}
	//******************************************* methods ************************************************
	async updateBalances() {
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
	getBalance(coin) {
		if (_.isEmpty(global.balances))
			throw new Error('Balances are not updated');
		if (!global.balances[coin])
			throw new Error('Coin is wrong');
		return Number(global.balances[coin].available) + Number(global.balances[coin].onOrder);
	};
	getAvailableBalance(coin) {
		if (_.isEmpty(global.balances))
			throw new Error('Balances are not updated');
		if (!global.balances[coin])
			throw new Error('Coin is wrong');
		return Number(global.balances[coin].available);
	};
	init() {
		this.updateBalances().then(()=>{
			ee.emit('wallet_updated');
		});
	}
}

let instance = new Wallet();

module.exports = instance;