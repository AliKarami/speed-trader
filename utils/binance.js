const config = require('../config');
const Binance = require('node-binance-api');
const instance = Binance().options(config.binance);

module.exports = instance;