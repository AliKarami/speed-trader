require('dotenv').config();
let assert = require('assert');
const wallet = require('../utils/wallet');

describe('Wallet', function() {
	beforeEach(function() {
		global.ticker = {};
		global.balances = {};
	});
	describe('updateBalances()', function() {
		it('should fill global.balances', function(done) {
			wallet.updateBalances().then(()=>{
				assert(!!global.balances['USDT']);
				assert(!!global.balances['BTC']);
				done();
			})
		});
		it('should return balances', function(done) {
			wallet.updateBalances().then((balances)=>{
				assert(!!balances['USDT']);
				assert(!!balances['BTC']);
				done();
			})
		});
	});
	describe('getBalance()', function () {
		it('should throw error if balances are not updated yet' ,function () {
			assert.throws(function () {
				wallet.getBalance('USDT');
			},Error,'Balances are not updated');
		});
		it('should throw error if wrong coin requested', function (done) {
			wallet.updateBalances().then(()=>{
				assert.throws(function () {
					wallet.getBalance('XXX');
				},Error,'Coin is wrong');
				done();
			});
		});
		it('should have USDT well formed', function (done) {
			wallet.updateBalances().then(()=>{
				let balance = wallet.getBalance('USDT');
				assert(!!balance);
				assert.equal(typeof balance, 'number');
				done();
			});
		});
	});
	describe('getAvailableBalance()', function () {
		it('should throw error if balances are not updated yet' ,function () {
			assert.throws(function () {
				wallet.getAvailableBalance('USDT');
			},Error,'Balances are not updated');
		});
		it('should throw error if wrong coin requested', function (done) {
			wallet.updateBalances().then(()=>{
				assert.throws(function () {
					wallet.getAvailableBalance('XXX');
				},Error,'Coin is wrong');
				done();
			});
		});
		it('should have USDT well formed', function (done) {
			wallet.updateBalances().then(()=>{
				let balance = wallet.getAvailableBalance('USDT');
				assert(!!balance);
				assert.equal(typeof balance, 'number');
				done();
			});
		});
	})
});