require('dotenv').config();
const assert = require('assert');
const Trade = require('../utils/trade');
const wallet = require('../utils/wallet');
const priceListener = require('../utils/priceListener');
const ee = require('../utils/eventEmiter');

describe('Trade', function() {
	before(function (done) {
		this.timeout(20000);
		priceListener.init().then(()=>{
			done();
		});
	});
	it('constructor',function () {
		let t1 = new Trade({
			market: 'BTCUSDT',
			entry: 1000,
			targets: [20000,21000,22000],
			targetsShare: [70,20,10],
			amount: 100,
			stopLossPercent: 5,
			trailing: true
		});
		assert.equal(t1.baseCoin,'USDT');
		let t3 = new Trade({
			market: 'BTCUSDT',
			entry: 1000,
			targets: [20000,21000,22000],
			targetsShare: [70,20,10],
			amount: 100,
			stopLossPercent: 5,
			stopLoss: 100,
			trailing: true
		});
		assert.equal(t3.stopLoss,1000 * 0.95);
		let t4 = new Trade({
			market: 'BTCUSDT',
			entry: 1000,
			targets: [20000,21000,22000],
			targetsShare: [70,20,10],
			amount: 100,
			stopLossPercent: 5,
			stopLoss: 999,
			trailing: true
		});
		assert.equal(t4.stopLoss,999);
	});
	it('validate market', function () {
		assert.throws(function () {
			new Trade({
				market: 123,
				entry: 1000,
				targets: [20000,21000,22000],
				targetsShare: [70,20,10],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Market is not a String');
		assert.throws(function () {
			new Trade({
				market: 'PPPXXX',
				entry: 1000,
				targets: [20000,21000,22000],
				targetsShare: [70,20,10],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Base coin should be BTC or USDT');
		assert.throws(function () {
			new Trade({
				market: 'XXXBTC',
				entry: 1000,
				targets: [20000,21000,22000],
				targetsShare: [70,20,10],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Market is not in valid markets');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 'salam',
				targets: [20000,21000,22000],
				targetsShare: [70,20,10],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Entry is NaN');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100000000,
				targets: [20000,21000,22000],
				targetsShare: [70,20,10],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Entry is more than current price');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: 20000,
				targetsShare: [100],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Targets are not an array');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [],
				targetsShare: [],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Targets are empty');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000],
				targetsShare: 100,
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Target shares is not an array');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000],
				targetsShare: [80,20],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Wrong target shares');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [120,-20],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Some shares are invalid');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [40,40],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Target shares are less than 100%');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,60],
				amount: 100,
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Target shares are more than 100%');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 'TooMuch',
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'Amount is NaN');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 100,
				stopLossPercent: 'ALittle',
				trailing: true
			});
		},Error,'StopLossPercent is NaN');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 100,
				stopLoss: 90,
				trailing: true
			});
		},Error,'Cannot have trailing without stopLossPercent');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 100,
				stopLossPercent: -5,
				trailing: true
			});
		},Error,'StopLossPercent is less than 0 or more than 50');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 100,
				stopLossPercent: 95,
				trailing: true
			});
		},Error,'StopLossPercent is less than 0 or more than 50');
		assert.throws(function () {
			new Trade({
				market: 'BTCUSDT',
				entry: 100,
				targets: [20000,21000],
				targetsShare: [60,40],
				amount: 100,
				stopLoss: 'NinetyNine',
				stopLossPercent: 5,
				trailing: true
			});
		},Error,'StopLoss is NaN');
	});
	it('validate wallet', function () {
		if (wallet.getAvailableBalance('USDT') < 1) {
			assert.throws(function () {
				new Trade({
					market: 'BTCUSDT',
					entry: 100,
					targets: [20000,21000,22000],
					targetsShare: [70,20,10],
					amount: 2,
					stopLossPercent: 5,
					trailing: true
				});
			},Error,'Not enough funds');
		} else if (wallet.getAvailableBalance('BTC') < 0.001) {
			assert.throws(function () {
				new Trade({
					market: 'ETHBTC',
					entry: 0.1,
					targets: [20000,21000,22000],
					targetsShare: [70,20,10],
					amount: 0.2,
					stopLossPercent: 5,
					trailing: true
				});
			},Error,'Not enough funds');
		}
	});
});