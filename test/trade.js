require('dotenv').config();
const assert = require('assert');
const Trade = require('../utils/trade');
require('../utils/priceListener');

describe('Trade', function() {
	beforeEach(function() {
		global.ticker = {};
		global.balances = {};
	});
	it('create ',function () {
		assert(true);
	});
});