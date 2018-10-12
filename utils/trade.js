const ee = require('./eventEmiter');
const Order = require('./order');
const _ = require('underscore');
const limits = require('../config').limits;
const wallet = require('./wallet');

class Trade {
	constructor(config) {
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
		if (!this.stopLoss) this.stopLoss = this.entry - (this.entry * this.stopLossPercent / 100);
	}
	async validate() {
		if (typeof this.market !== 'string')
			throw new Error('Market is not a String');
		if (this.market.substr(-3) === 'BTC')
			this.baseCoin='BTC';
		else if (this.market.substr(-4) === 'USDT')
			this.baseCoin='USDT';
		else
			throw new Error('Base coin should be BTC or USDT');
		if (!global.ticker[this.market])
			throw new Error('Market is not in valid markets');
		if (typeof this.entry !== 'number')
			throw new Error('Entry is NaN');
		if (this.entry > global.ticker[this.market])
			throw new Error('Entry is more than current price');
		if (this.targets.constructor !== Array)
			throw new Error('Targets are not an array');
		if (this.targets.length < 1)
			throw new Error('Targets are empty');
		if (this.targets.length === 1)
			this.targetsShare = [100];
		if (this.targetsShare.constructor !== Array)
			throw new Error('Target shares is not an array');
		if (this.targetsShare.length !== this.targets.length)
			throw new Error('Wrong target shares');
		let targetsShareSum = _.reduce(this.targetsShare, function(memo, num){
			if (num < 0 || num > 100)
				throw new Error('Some shares are invalid');
			return memo + num;
			}, 0);
		if (targetsShareSum < 99.999)
			throw new Error('Target shares are less than 100%');
		if (targetsShareSum > 100)
			throw new Error('Target shares are more than 100%');
		if (typeof this.amount !== 'number')
			throw new Error('Amount is NaN');
		if (!this.trailing)
			this.trailing = false;
		if (!!this.stopLossPercent && typeof this.stopLossPercent !== 'number')
			throw new Error('StopLossPercent is NaN');
		if (this.trailing && !this.stopLossPercent)
			throw new Error('Cannot have trailing without stopLossPercent');
		if (!!this.stopLossPercent && ((this.stopLossPercent > limits.MAX_STOP_LOSS_PERCENT) || (this.stopLossPercent < 0)))
			throw new Error('StopLossPercent is less than 0 or more than ' + limits.MAX_STOP_LOSS_PERCENT);
		if (!!this.stopLoss && typeof this.stopLoss !== 'number')
			throw new Error('StopLoss is NaN');

		//validate wallet
		await wallet.updateBalances();
		let fund = wallet.getAvailableBalance(this.baseCoin);
		if (fund < this.amount)
			throw new Error('Not enough funds');
	};
	async start() {
		await this.validate();
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