require('dotenv').config();
const priceListener = require('./priceListener');
const wallet = require('./wallet');
const _ = require('underscore');
const ee = require('./eventEmiter');
priceListener.init().then(()=>{
	priceListener.start();
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

