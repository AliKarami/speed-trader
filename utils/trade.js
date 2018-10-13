const ee = require('./eventEmiter');
const Order = require('./order');
const _ = require('underscore');
const limits = require('../config').limits;
const wallet = require('./wallet');

class Trade {
	constructor(config) {
		this.validate(config);
		this.market = config.market;
		this.baseCoin = '';
		this.entry = config.entry;
		this.targets = config.targets;
		this.targetsShare = config.targetsShare;
		this.amount = config.amount;
		this.stopLossPercent = config.stopLossPercent;
		this.stopLoss = config.stopLoss;
		this.trailing = config.trailing;
		this.order = new Order(this.market);
		if (this.market.substr(-3) === 'BTC')
			this.baseCoin='BTC';
		else if (this.market.substr(-4) === 'USDT')
			this.baseCoin='USDT';
		if (!this.stopLoss)
			this.stopLoss = this.entry - (this.entry * this.stopLossPercent / 100);
		else if (!!this.stopLossPercent && this.stopLoss < (this.entry * (100 - this.stopLossPercent) / 100))
			this.stopLoss = (this.entry * (100 - this.stopLossPercent) / 100);
		if (this.targets.length === 1)
			this.targetsShare = [100];
		if (!this.trailing)
			this.trailing = false;
	}

	validate(config) {
		if (typeof config.market !== 'string')
			throw new Error('Market is not a String');
		if (config.market.substr(-3) !== 'BTC' && config.market.substr(-4) !== 'USDT')
			throw new Error('Base coin should be BTC or USDT');
		if (!global.ticker[config.market])
			throw new Error('Market is not in valid markets');
		if (typeof config.entry !== 'number')
			throw new Error('Entry is NaN');
		if (config.entry > global.ticker[config.market])
			throw new Error('Entry is more than current price');
		if (config.targets.constructor !== Array)
			throw new Error('Targets are not an array');
		if (config.targets.length < 1)
			throw new Error('Targets are empty');
		if (!!config.targetsShare && config.targetsShare.constructor !== Array)
			throw new Error('Target shares is not an array');
		if (!!config.targetsShare && config.targetsShare.length !== config.targets.length)
			throw new Error('Wrong target shares');
		if (config.targets.length > 1) {
			let targetsShareSum = _.reduce(config.targetsShare, function(memo, num){
				if (num < 0 || num > 100)
					throw new Error('Some shares are invalid');
				return memo + num;
			}, 0);
			if (targetsShareSum < 99.999)
				throw new Error('Target shares are less than 100%');
			if (targetsShareSum > 100)
				throw new Error('Target shares are more than 100%');
		}
		if (typeof config.amount !== 'number')
			throw new Error('Amount is NaN');
		if (!!config.stopLossPercent && typeof config.stopLossPercent !== 'number')
			throw new Error('StopLossPercent is NaN');
		if (config.trailing && !config.stopLossPercent)
			throw new Error('Cannot have trailing without stopLossPercent');
		if (!!config.stopLossPercent && ((config.stopLossPercent > limits.MAX_STOP_LOSS_PERCENT) || (config.stopLossPercent < 0)))
			throw new Error('StopLossPercent is less than 0 or more than ' + limits.MAX_STOP_LOSS_PERCENT);
		if (!!config.stopLoss && typeof config.stopLoss !== 'number')
			throw new Error('StopLoss is NaN');
	}
	async validateWallet() {
		await wallet.updateBalances();
		let fund = wallet.getAvailableBalance(this.baseCoin);
		if (fund < this.amount)
			throw new Error('Not enough funds');
	};
	async start() {
		await this.validateWallet();
		console.log(this.market + ' started.');
		//logic
		ee.addListener(this.market, this.process);
	};
	process(price) {
		price = Number(price);
		if (price >= this.targets[0])
			this.targetReached();
		else if (price <= this.stopLoss)
			this.stopLossReached();

		this.updateStopLoss(price);
		console.log(this.market + ' price: ' + price);
	};
	pause() {
		ee.removeListener(this.market, this.process);
		//logic
		console.log(this.market + ' paused.');
	};
	close() {
		//logic
		this.closeTrade();
	};
	updateStopLoss(currentPrice) {
		if (this.trailing && this.stopLossPercent > 0) {
			let newStopLoss = currentPrice - (currentPrice * this.stopLossPercent / 100);
			if (newStopLoss > this.stopLoss) this.stopLoss = newStopLoss;
		}
	};
	targetReached() {
		//logic
		let targetAmount = this.amount * this.targetsShare[0] / 100;
		this.amount = this.amount - targetAmount;
		this.order.marketSell(targetAmount);
		this.targets.shift();
		if (this.targets.length === 0) {
			this.allTargetsReached();
		} else {
			let deletedShare = this.targetsShare.shift();
			for (let i=0, len=this.targetsShare.length; i < len; i++) {
				this.targetsShare[i] *= (100 / (100 - deletedShare));
			}
		}
		wallet.updateBalances();
	};
	stopLossReached() {
		//logic
		this.order.marketSell(this.amount);
		wallet.updateBalances();
		this.closeTrade();
	};
	allTargetsReached() {
		//logic
		this.closeTrade();
	};
	closeTrade() {
		ee.removeListener(this.market, this.process);
		console.log(this.market + ' closed.');
	};
}

module.exports = Trade;