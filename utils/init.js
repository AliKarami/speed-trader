require('dotenv').config();
require('./priceListener');
const wallet = require('./wallet');
const _ = require('underscore');
const ee = require('./eventEmiter');
wallet.updateBalances().then((balances) => {
	ee.emit('wallet_updated');
});
module.exports = () => {
	let priceListenerStarted = new Promise((resolve)=>{
		ee.on('price_listener_started',()=>{resolve()});
	});
	let walletUpdated = new Promise((resolve)=>{
		ee.on('wallet_updated',()=>{resolve()});
	});
	return Promise.all([priceListenerStarted, walletUpdated]);
};

