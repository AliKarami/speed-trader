function Trade(config) {
	//******************************************* fields ************************************************
	this.market = config.market;
	this.entry = config.entry;
	this.targets = config.targets;
	this.targetsShare = config.targetsShare;
	this.amount = config.amount;
	this.stopLossPercent = config.stopLossPercent;
	this.stopLoss = config.stopLoss;
	this.trailing = config.trailing;


	//******************************************* logic ************************************************
	//verify()
	if (!this.stopLoss) this.stopLoss = this.entry - (this.entry * this.stopLossPercent / 100);
	//addListenerOnMarketPrice()

	//******************************************* methods ************************************************
	this.updateStopLoss = (currentPrice) => {
		if (this.trailing && this.stopLossPercent > 0) {
			let newStopLoss = currentPrice - (currentPrice * this.stopLossPercent / 100);
			if (newStopLoss > this.stopLoss) this.stopLoss = newStopLoss;
		}
	};
	this.targetReached = () => {
		//logic
		this.targets.shift();
		if (this.targets.length === 0) {
			this.allTargetsReached();
		} else {
			let deletedShare = this.targetsShare.shift();
			for (let i=0, len=this.targetsShare.length; i < len; i++) {
				this.targetsShare[i] *= (100 / (100 - deletedShare));
			}
		}
	};
	this.stopLossReached = () => {
		//logic
		this.closeTrade();
	};
	this.allTargetsReached = () => {
		//logic
		this.closeTrade();
	};
	this.closeTrade = () => {

	};
}

module.exports = Trade;