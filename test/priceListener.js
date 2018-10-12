require('dotenv').config();
const assert = require('assert');
const ee = require('../utils/eventEmiter');
let priceListener;

describe('PriceListener', function() {
	before(function() {
		global.ticker = {};
		global.balances = {};
		priceListener = require('../utils/priceListener');
		priceListener.markets = [];
	});
	it('constructor', function (done) {
		this.timeout(5000);
		priceListener.init().then(() => {
			assert(priceListener.markets.length > 0);
			assert.equal(typeof global.ticker['BTCUSDT'], 'number');
			assert(global.ticker['BTCUSDT'] > 0);
			done();
		});
	});
	it('start()', function (done) {
		this.timeout(5000);
		priceListener.start();
		ee.on('BTCUSDT', (price) => {
			assert.equal(typeof price, 'number');
			assert(price > 0);
			done();
		});
	});
	it('stop()', function (done) {
		priceListener.stop();
		ee.on('BTCUSDT', (price) => {
			assert(false);
		});
		setTimeout(() => {
			done();
		} ,1000);
	});
});