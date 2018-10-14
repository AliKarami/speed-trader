# Speed Trader

_Caution: Do Not Use This App till a Stable Release, WORK IN PROGRESS!_

![SpeedTrader](https://cdn3.iconfinder.com/data/icons/stock-market/512/bull_stock_trader-512.png)
## What it is?
This application lets you place trades simply using:
`entry`, `targets`, `targetsShare`, `stopLoss`, `trailing`

so you should not worry about placing stop-loss and sell limits simultaneously on Binance or changing the stop-loss limit price to save your profit. 

## How to Setup?
You can clone this repo into your computer

```bash
git clone https://github.com/AliKarami/speed-trader.git
```

if you do not have nodejs/npm on your system, you have to install them:

**Debian and Ubuntu based Linux distributions:**

```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -brew install node
sudo apt-get install -y nodejs
```

**MacOS:**

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

**Windows:**

```
Use Windows Installer:
https://nodejs.org/dist/v10.12.0/node-v10.12.0-x86.msi
```

then you should navigate to project directory and run:

```bash
npm install --only=production
```

create a file named `.env` in the root directory of project and fill it this way:

```dotenv
API_KEY={YOUR_API_KEY}
API_SECRET={YOUR_API_SECRET}
TEST=true
```

open `app.js` in your text editor, create a trade and play with it, then start the app using this command:

```bash
npm start
```

## Supported Exchanges

- Binance

## Examples
TODO