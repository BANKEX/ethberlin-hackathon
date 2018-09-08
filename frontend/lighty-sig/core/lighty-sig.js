// if (typeof WavesAPI == 'undefined')
//     throw new Error('Fail to connect WavesAPI library\n\nUse npm i -s @waves/waves-api or bower install @waves/waves-api\n\nThen add <script src="./path/to/waves-api.min.js"></script> in your HTML body');
if (typeof Web3 == 'undefined')
    throw new Error('Fail to connect Web3 library\n\nCopy data from "https://raw.githubusercontent.com/ethereum/web3.js/develop/dist/web3.min.js" and add it to web3.min.js\n\nThen add <script src="./path/to/web3.min.js"></script> in your HTML body');
// if (typeof Bitcore == 'undefined')
//     throw new Error('Fail to connect Bitcoin library\n\nUse \'npm install bitcore-lib\'\n\nCreate any js file with: \nconst bitcore = require(\'bitcore-lib.js\');\nmodule.exports = bitcore;\n\nNext \'npm install -g browserify\' and do in currenct folder \'browserify your_file.js -s Bitcore > bitcore-lib.js\'\n\nThen add <script src="./path/to/bitcore-lib.js"></script> in your HTML body"');
// if (typeof Litecore == 'undefined')
//     throw new Error('Fail to connect Litecoin library\n\nUse \'npm install litecore-lib\'\n\nCreate any js file with: \nconst litecore = require(\'litecore-lib.js\');\nmodule.exports = litecore;\n\nNext \'npm install -g browserify\' and do in currenct folder \'browserify your_file.js -s Litecore > litecore-lib.js\'\n\nThen add <script src="./path/to/litecore-lib.js"></script> in your HTML body"');
// if (typeof BitcoinCash == 'undefined')
//     throw new Error('Fail to connect BitcoinCash library\n\nUse \'npm install bitcoincashjs\'\n\nCreate any js file with: \nconst bitcoincashjs = require(\'bitcoincashjs.js\');\nmodule.exports = bitcoincashjs;\n\nNext \'npm install -g browserify\' and do in currenct folder \'browserify your_file.js -s BitcoinCash > bitcoincashjs.js\'\n\nThen add <script src="./path/to/bitcoincashjs.js"></script> in your HTML body"');

// const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);
if (typeof web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
} else {
    window.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
    );
}

/**
 * Convert Number to BigNumber
 * @param x Some number
 * @returns {*} BigNumber
 */
const tbn = (x) => new BigNumber(x);

const assets = {
    'Waves': 'WAVES',
    'Bitcoin': '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
    'BitcoinCash': 'zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy',
    'Ethereum': '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    'ZCash': 'BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa',
    'Litecoin': 'HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk',
    'Dash': 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
    'Monero': '5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3',
    'US_Dollar': 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    'Euro': 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU'
};

const currency = {
    "Bitcoin": {
        course: 'btc-rub',
        name: "Bitcoin",
        ticker: "BTC",
        assetID: assets.Bitcoin
    },
    "Ethereum": {
        course: 'eth-rub',
        name: "Ethereum",
        ticker: "ETH",
        assetID: assets.Ethereum
    },
    "Waves": {
        course: 'waves-rub',
        name: "Waves",
        ticker: "WAVES",
        assetID: assets.Waves
    },
    "ZCash": {
        course: 'zec-rub',
        name: "ZCash",
        ticker: "ZEC",
        assetID: assets.ZCash
    },
    "Litecoin": {
        course: 'ltc-rub',
        name: "Litecoin",
        ticker: "LTC",
        assetID: assets.Litecoin
    },
    "US Dollar": {
        course: 'usd-rub',
        name: "US Dollar",
        name1: 'US_Dollar',
        ticker: "USD",
        assetID: assets.US_Dollar
    },
    "Euro": {
        course: 'eur-rub',
        name: "Euro",
        ticker: "EUR",
        assetID: assets.Euro
    },
};

const exchange = {
    'Waves': {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.Bitcoin
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Waves
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Waves
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Waves
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.Euro
        }
    },
    'Bitcoin': {
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.Bitcoin
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Bitcoin
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Bitcoin
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Bitcoin
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.Euro
        }
    },
    'Ethereum': {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Waves
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Ethereum
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Ethereum
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Euro
        }
    },
    "ZCash": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Waves
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Ethereum
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.ZCash
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Euro
        }
    },
    "Litecoin": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Waves
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Ethereum
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.ZCash
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Euro
        }
    },
    "US Dollar": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.US_Dollar
        },
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.US_Dollar
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.US_Dollar
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.US_Dollar
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'buy',
            'assetID1': assets.Euro,
            'assetID2': assets.US_Dollar
        }
    },
    "Euro": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.Euro
        },
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.Euro
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Euro
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Euro
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Euro
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Euro,
            'assetID2': assets.US_Dollar
        }
    }
};

class LightySig {

    constructor() {
        // this.Waves = _Waves;
        this.Ethereum = _Ethereum;
        // this.Bitcoin = _Bitcoin;
        // this.Litecoin = _Litecoin;
        // this.BitcoinCash = _BitcoinCash;
        // this.utils = _utils;
    }
}

// const _Waves = {
//     network: {
//         change: (network) => {
//             if (network === 'mainnet')
//                 _Waves.network.current = _Waves.network.mainnet;
//             else if (network === 'testnet')
//                 _Waves.network.current = _Waves.network.testnet;
//             else
//                 throw new Error(`Use 'mainnet' or 'testnet', not ''${network}''`);
//         },
//         current: WavesAPI.MAINNET_CONFIG,
//         testnet: WavesAPI.TESTNET_CONFIG,
//         mainnet: WavesAPI.MAINNET_CONFIG,
//     },
//     account: {
//         /**
//          * Allows to create new key pairs
//          * @returns {Seed} Seed Object (phrase, address, keyPair)
//          */
//         create: () => {
//             const seed = Waves.Seed.create();
//             return seed;
//         },
//         /**
//          * Allows to encrypt seed phrase
//          * @param seed User's seed phrase
//          * @param password Encryption key
//          * @returns {*} Encrypted Seed
//          */
//         encrypt: (phrase, password) => {
//             const seed = _Waves.account.getSeedFromPhrase(phrase);
//             const encrypted = seed.encrypt(password);
//             return encrypted;
//         },
//         /**
//          * Allows to decrypt seed phrase
//          * @param encryptedSeed Encrypted seed
//          * @param password Decryption key
//          * @returns {string} Seed Phrase
//          */
//         decrypt: (encryptedSeed, password) => {
//             const restoredPhrase = Waves.Seed.decryptSeedPhrase(encryptedSeed, password);
//             return restoredPhrase;
//         },
//         /**
//          * Get seed object from seed phrase
//          * @param phrase A set of 15 words
//          * @returns {Seed} {Seed} Seed Object (phrase, address, keyPair)
//          */
//         getSeedFromPhrase: (phrase) => {
//             const seed = Waves.Seed.fromExistingPhrase(phrase);
//             return seed;
//         },
//         /**
//          * Allows to get address from seed phrase
//          * @param phrase A set of 15 words
//          * @returns {*} User's address
//          */
//         getAddress: (phrase) => {
//             return _Waves.account.getSeedFromPhrase(phrase).address;
//         },
//     },
//     balance: {
//         /**
//          * Allows to get Waves balance
//          * @param address User's address
//          * @returns {Promise<any>} balance
//          */
//         waves: async (address) => {
//             const balance = await Waves.API.Node.addresses.balance(address, 6);
//             return balance;
//         },
//         /**
//          * Allows to get balance of all assets excluding Waves
//          * @param address User's address
//          * @returns {Promise<balances|((address: string) => Promise<any>)|((address: string) => Promise<any>)>} Array of assets balances
//          */
//         assets: async (address) => {
//             const user = await Waves.API.Node.assets.balances(address);
//             return user.balances;
//         },
//         /**
//          * Allows to get balance of any one asset
//          * @param address User's address
//          * @param assetID ID of asset
//          * @returns {Promise<*>} balance
//          */
//         byAssetID:
//             async (address, assetID) => {
//                 const user = await Waves.API.Node.assets.balance(address, assetID);
//                 return user.balance;
//             },
//         /**
//          * Allows to get object with balances of any assetsId
//          * @param address User's address
//          * @param assetsID Array or Object includes assetsId of currencies
//          * @returns {Promise<void>} Object of balances
//          */
//         byAssetIDArray:
//             async (address, assetsID) => {
//                 const assetsBalance = await Balance.assets(address);
//
//                 let balances = {};
//
//                 for (let i in assetsID) {
//                     assetsBalance.map(asset => {
//                         if (asset.assetId == assetsID[i])
//                             balances[i] = asset.balance
//                     });
//                 }
//
//                 return balances;
//             },
//     },
//     transactions: {
//         /**
//          * Allows to sign transaction
//          * @param recipient User that will get currency
//          * @param assetId AssetId of the currency
//          * @param amount Amount of currency
//          * @param seedPhrase A set of 15 words
//          * @returns {Promise<any>} Signed object of transaction
//          */
//         signTransaction: async (recipient, assetId, amount, seedPhrase) => {
//             const sender = _Waves.account.getSeedFromPhrase(seedPhrase);
//
//             const transferData = {
//                 type: Waves.constants.TRANSFER_TX,
//                 sender: sender.keyPair.address,
//                 recipient: recipient,
//                 senderPublicKey: sender.keyPair.publicKey,
//                 assetId: assetId,
//                 amount: amount,
//                 feeassetID: assets.Waves,
//                 fee: 100000,
//                 attachment: '',
//                 timestamp: Date.now()
//             };
//
//             let signedTransaction = await Waves.API.Node.transactions.getSignature('transfer', transferData, sender.keyPair);
//
//             let data = JSON.parse(signedTransaction.body);
//             data.type = Waves.constants.TRANSFER_TX;
//
//             return data;
//         },
//         /**
//          * Allows to send signed transaction
//          * @param data Signed transaction object
//          * @returns {Promise<void>}
//          */
//         sendSigned: async (data) => {
//             const responseData = await Waves.API.Node.transactions.rawBroadcast(data);
//             return responseData;
//         },
//         /**
//          * Allows to sign and send a transaction (currency)
//          * @param recipient User that will get currency
//          * @param assetId AssetId of the currency
//          * @param amount Amount of currency
//          * @param seedPhrase A set of 15 words
//          * @returns {Promise<any>} Signed object of transaction
//          */
//         send: async (recipient, assetId, amount, seedPhrase) => {
//             const sender = _Waves.account.getSeedFromPhrase(seedPhrase);
//
//             const transferData = {
//                 type: Waves.constants.TRANSFER_TX,
//                 sender: sender.keyPair.address,
//                 recipient: recipient,
//                 senderPublicKey: sender.keyPair.publicKey,
//                 assetId: assetId,
//                 amount: amount,
//                 feeassetID: assets.Waves,
//                 fee: 100000,
//                 attachment: '',
//                 timestamp: Date.now()
//             };
//
//             const responseData = await Waves.API.Node.transactions.broadcast('transaction', transferData, sender.keyPair);
//             return responseData;
//         }
//     },
//     exchange: {
//         /**
//          * Allows to get asset pair with bids and asks
//          * @param currencyToSell Currency that will be sell
//          * @param currencyToBuy Currency that will be buy
//          * @returns {Promise<any>} Order book object
//          */
//         getOrderBook: async (currencyToSell, currencyToBuy) => {
//             const sell = currency[currencyToSell].assetID;
//             const buy = currency[currencyToBuy].assetID;
//
//             const response = await $.get({
//                 url: `https://matcher.wavesplatform.com/matcher/orderbook/${sell}/${buy}`,
//                 type: 'GET',
//                 dataType: 'text'
//             });
//
//             return JSON.parse(response);
//         },
//         /**
//          * Calculate order properties
//          * @param currencyToSell Currency that will be sell
//          * @param currencyToBuy Currency that will be buy
//          * @param amount Amount of currency that will be buy
//          * @returns {Promise<{amountAsset: *, priceAsset: *, type: *, amount: *, price: (*|content.price|{type, required})}>} Object with properties
//          */
//         getOrderProperties: async (currencyToSell, currencyToBuy, amount) => {
//             const orderBook = await _Waves.exchange.getOrderBook(currencyToSell, currencyToBuy);
//
//             const type = exchange[currencyToSell][currencyToBuy].type;
//
//             let dependency;
//             if (type === 'sell') {
//                 dependency = 'bids';
//             } else {
//                 dependency = 'asks';
//             }
//
//             let priceIndex;
//             for (let i in orderBook[dependency]) {
//                 const price = orderBook[dependency][i].price;
//                 let _amount = amount;
//                 if (type === 'sell')
//                     _amount = _utils.tw(tbn(amount).div(price)).toNumber();
//                 if (orderBook[dependency][i].amount >= _amount) {
//                     priceIndex = i;
//                     amount = _amount;
//                     break;
//                 }
//             }
//
//             const price = orderBook[dependency][priceIndex].price;
//
//             return {
//                 amountAsset: orderBook.pair.amountAsset,
//                 priceAsset: orderBook.pair.priceAsset,
//                 type: type,
//                 amount: amount,
//                 price: price,
//             }
//         },
//         /**
//          * Allows to create tx object for exchange cryptocurrencies
//          * @param amountAssetId ID of asset that will be in amount field
//          * @param priceAssetId ID of asset that will be in price field
//          * @param orderType Type of order (buy or sell)
//          * @param amount Amount of currency that will be sell or buy
//          * @param price Exchange rate
//          * @param expiration After that time created and not used order will be closed
//          * @param sender Seed Object
//          * @returns {Promise<{senderPublicKey: *, matcherPublicKey, amountAsset: *, priceAsset: *, orderType: *, amount: *, price: *, timestamp: number, expiration: number, matcherFee: number}>} tx object
//          */
//         createTXObject: async (amountAssetId, priceAssetId, orderType, amount, price, expiration, sender) => {
//             const matcherPublicKey = await Waves.API.Matcher.getMatcherKey();
//
//             const transferData = {
//                 senderPublicKey: sender.keyPair.publicKey,
//                 matcherPublicKey: matcherPublicKey,
//                 amountAsset: amountAssetId,
//                 priceAsset: priceAssetId,
//                 orderType: orderType,
//                 amount: amount,
//                 price: price,
//                 timestamp: Number(Date.now()),
//                 expiration: Number(Date.now() + expiration),
//                 matcherFee: 300000
//             };
//
//             return transferData;
//         },
//         /**
//          * Allows to sign exchange transaction
//          * @param currencyToSell Currency that will be sell
//          * @param currencyToBuy Currency that will be buy
//          * @param amount Amount of currency that will be buy
//          * @param expiration After that time created and not used order will be closed
//          * @param seedPhrase A set of 15 words
//          * @returns {Promise<any>} Sign transaction object
//          */
//         signTransaction: async (currencyToSell, currencyToBuy, amount, expiration, seedPhrase) => {
//             const sender = _Waves.account.getSeedFromPhrase(seedPhrase);
//
//             const orderProperties = await _Waves.exchange.getOrderProperties(currencyToSell, currencyToBuy, amount);
//
//             try {
//                 const TX_OBJECT = await _Waves.exchange.createTXObject(
//                     orderProperties.amountAsset,
//                     orderProperties.priceAsset,
//                     orderProperties.type,
//                     orderProperties.amount,
//                     orderProperties.price,
//                     expiration,
//                     sender
//                 );
//
//                 let signedTransaction = await Waves.API.Matcher.signTransaction(TX_OBJECT, sender.keyPair);
//
//                 let data = JSON.parse(signedTransaction.body);
//
//                 return data;
//             } catch (e) {
//                 throw e;
//             }
//         },
//         /**
//          * Allows to send signed exchange transaction
//          * @param data Signed transaction object
//          * @returns {Promise<void>}
//          */
//         sendSigned: async (data) => {
//             const transferData = {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8'
//                 },
//                 body: JSON.stringify(data)
//             };
//
//             const responseData = await Waves.API.Matcher.send(transferData);
//             return responseData;
//         },
//         /**
//          * Allows to create order with min price in buy and max price in sell
//          * @param currencyToSell Currency that will be sell
//          * @param currencyToBuy Currency that will be buy
//          * @param amount Amount of currency that will be buy
//          * @param expiration After that time created and not used order will be closed
//          * @param seedPhrase A set of 15 words
//          * @returns {Promise<void>} Accepted order (or not accepted) object
//          */
//         createCustomOrder: async (currencyToSell, currencyToBuy, amount, expiration, seedPhrase) => {
//             const sender = _Waves.account.getSeedFromPhrase(seedPhrase);
//
//             const orderProperties = await _Waves.exchange.getOrderProperties(currencyToSell, currencyToBuy, amount);
//
//             try {
//                 const TX_OBJECT = await _Waves.exchange.createTXObject(
//                     orderProperties.amountAsset,
//                     orderProperties.priceAsset,
//                     orderProperties.type,
//                     orderProperties.amount,
//                     orderProperties.price,
//                     expiration,
//                     sender
//                 );
//
//                 return await Waves.API.Matcher.createOrder(TX_OBJECT, sender.keyPair);
//             } catch (e) {
//                 throw e;
//             }
//         },
//     }
// };

const _Ethereum = {
    /**
     * Allows to change RPC url. Default: http://localhost:8545/
     * @param url New RPC URL
     */
    setRPCurl: (url) => {
        window.web3 = new Web3(new Web3.providers.HttpProvider(url))
    },
    account: {
        /**
         * Allows to create new private key
         * @returns {string} Private key
         */
        create: () => {
            let params = {
                keyBytes: 32,
                ivBytes: 16
            };
            let dk = keythereum.create(params);
            return "0x" + dk.privateKey.reduce((memo, i) => {
                return memo + ('0' + i.toString(16)).slice(-2);
            }, '');
        },
        /**
         * Allows to get address from private key
         * @param privateKey
         * @returns {*} Address
         */
        getAddress: (privateKey) => {
            let _privateKey = "";
            for (let i = 2; i < privateKey.length; i++) {
                _privateKey += privateKey[i];
            }
            return keythereum.privateKeyToAddress(_privateKey);
        }
    },
    balance: {
        /**
         * Allows to get address balance
         * @param address Address
         * @returns {Promise<*>} Balance (don't forget about 1e18)
         */
        getBalance: async (address) => {
            try {
                return await web3.eth.getBalance(address);
            } catch (e) {
                throw new Error('Can\'t get the balance. Please, check your internet connection');
            }
        }
    },
    transactions: {
        /**
         * Allows to sign any Ethereum transaction.
         * Using this function you can sign one or more tx in one time
         * @param receivers Array or string of the receivers (can be contract address)
         * @param values Array or string of values (if it non-payable func add 0 to array's elements)
         * @param privateKey Array or string of sender's Private Keys
         * @param datas Array or string of hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         * @returns {Promse<Array>} Signed hex strings
         */
        signTransaction: async (receivers, values, privateKeys, datas) => {
            const converted = toArrays(receivers, values, privateKeys, datas);
            const maxLength = converted.maxLength;
            const arrays = converted.arrays;
            const _receivers = arrays[0];
            const _values = arrays[1];
            const _privateKeys = arrays[2];
            const _datas = arrays[3];

            if (isLengthError(maxLength, ...arrays))
                return new Error(`You have ${_receivers.length} receivers, ${_values.length} values and ${_datas.length} datas and ${_privateKeys.length} privateKeys. It should be equal.`);

            const addresses = _privateKeys.map(key => _Ethereum.account.getAddress(key));

            const nonces = {};
            for (let i in addresses) {
                if (!nonces[addresses[i]])
                    nonces[addresses[i]] = await web3.eth.getTransactionCount(addresses[i]);
            }

            const signedTX = [];

            for (let i in _receivers) {
                const txParam = {
                    nonce: nonces[addresses[i]],
                    to: _receivers[i],
                    value: _values[i],
                    from: addresses[i],
                    data: _datas[i],
                    gasPrice: 0x3b9bca00,
                    gas: 210000
                };
                const tx = new ethereumjs.Tx(txParam);
                const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(_privateKeys[i].substring(2), 'hex');
                tx.sign(privateKeyBuffer);
                const serializedTx = tx.serialize();
                signedTX.push('0x' + serializedTx.toString('hex'));
                nonces[addresses[i]]++;
            }

            return signedTX;
        },
        /**
         * Allows to send signed transactions to blockchain
         * @param rawTransations Signed hex string
         * @returns {Promise<Array>} if success tx hash
         */
        sendSigned: async (rawTransations) => {
            if (typeof rawTransations != 'object')
                rawTransations = [rawTransations];

            const results = [];

            for (let i in rawTransations) {
                await web3.eth.sendSignedTransaction(rawTransations[i], (err, transactionHash) => {
                    if (err) {
                        results.push(err);
                        return;
                    }
                    results.push(transactionHash);
                });
            }
            return results;
        },
    },
    contract: {
        /**
         * Creates a new contract instance with all its methods and events defined in its json interface object
         * @param {Array} CONTRACT_ABI  application binary interface (look at remix)
         * @param {String} CONTRACT_ADDRESS Address of contract
         * @returns {Object} Contract instance
         */
        getInstance: (CONTRACT_ABI, CONTRACT_ADDRESS) => {
            const instance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            return instance;
        },
        /**
         * Allows you to receive hexadecimal data for a function call using a manual signature and sending a transaction
         * @param {Object} instance Contract instance
         * @param {String} methodName Name of the solidity function
         * @param {Array}parameters Solidity function parameters
         * @returns {*} hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         */
        getCallData: (instance, methodName, ...parameters) => {
            if (!isArray(parameters[0]))
                parameters = [parameters];
            const data = instance.methods[methodName](...parameters[0]).encodeABI();
            return data;
        },
        /**
         * Allows to call get function on contract
         * @param {Object} instance Contract instance
         * @param {String} methodName Name of the solidity function
         * @param {String} addressFrom Sender address
         * @param {Raw of sol func parameters} parameters Solidity function parameters
         * @returns {Promise<*>} Result
         */
        get: async (instance, methodName, addressFrom, ...parameters) => {
            const result = await instance.methods[methodName](...parameters).call({from: addressFrom});
            return result;
        },
        /**
         * Allows to call function that will write data to blockchain
         * @param {Array|Object} instances Contract instance
         * @param {Array|String} methodNames Contract method
         * @param {Array|String} privateKeys sender private key
         * @param {Array(Array)|Array} parameters
         * @return {Promise<Array>} tx hash
         */
        set: async (instances, methodNames, privateKeys, parameters) => {
            if (
                (!isArray(methodNames) && isObject(methodNames)) ||
                (!isArray(privateKeys) && isObject(privateKeys)) ||
                (!isArray(parameters[0]) && isObject(parameters[0]))
            ) {
                throw new Error('Parameters must have array or string type');
            }

            const converted = toArrays(instances, methodNames, privateKeys, parameters);
            const arrays = converted.arrays;
            const _instances = arrays[0];
            const _methodsNames = arrays[1];
            const _privateKeys = arrays[2];
            const _parameters = arrays[3];

            const data = [];
            for (let i in _methodsNames)
                data.push(_Ethereum.contract.getCallData(_instances[i], _methodsNames[i], _parameters[i]));

            const contracts = _instances.map(instance => instance._address);

            const signedTransactions = await _Ethereum.transactions.signTransaction(contracts, 0, _privateKeys, data);

            return await _Ethereum.transactions.sendSigned(signedTransactions);
        }
    },
    utils: {
        /**
         * Convert Number (or BN) to this * 10^18
         * @param x Some number
         * @returns {*} Number * 10^18
         */
        tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e18).toFixed(0) : tbn(x).times(1e18).toFixed(0),

        /**
         * Convert from minimal Ethereum unit
         * @param x Some number
         * @returns {*} Converted number
         */
        fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber()
    }
};

// const _Litecoin = {
//     network: {
//         change: (network) => {
//             const net = _Litecoin.network.current = _Litecoin.network[network];
//             if (!net)
//                 throw new Error(`Use 'mainnet' or 'testnet', not ''${network}''`);
//         },
//         current: Litecore.Networks.testnet,
//         testnet: Litecore.Networks.testnet,
//         mainnet: Litecore.Networks.livenet,
//     },
//     account: {
//         /**
//          * Allows to create new private key
//          * @returns Private key
//          */
//         create: () => {
//             return new Litecore.PrivateKey(_Litecoin.network.current).toString();
//         },
//         /**
//          * Allows to get address from private key
//          * @param privateKey
//          * @returns {*} Address
//          */
//         getAddress: (privateKey) => {
//             return new Litecore.PrivateKey(privateKey).toAddress(_Litecoin.network.current).toString();
//         }
//     },
//     balance: {
//         /**
//          * Allows to get address balance
//          * @param address Address
//          * @returns {Promise<*>} Balance (don't forget about 1e18)
//          */
//         getBalance: async (address) => {
//             if (!Litecore.Address.isValid(address))
//                 throw new Error('Entered address is invalid');
//             const URL = {
//                 livenet: 'https://chain.so/api/v2/get_address_balance/LTC/' + address,
//                 testnet: 'https://chain.so/api/v2/get_address_balance/LTCTEST/' + address
//             };
//             try {
//                 const result = await query('GET', URL[_Litecoin.network.current.name]);
//                 return _utils.tw(result.data.confirmed_balance).toNumber();
//             } catch (e) {
//                 throw new Error('Can\'t get the balance. Please, check your internet connection');
//             }
//         },
//         /**
//          * Allows to get all unspent transaction outputs
//          * @param address User address
//          * @return {Promise<*|Array>} Array of UTXOs
//          */
//         getUTXOs: async (address) => {
//             const URL = {
//                 livenet: 'https://chain.so/api/v2/get_tx_unspent/LTC/' + address,
//                 testnet: 'https://chain.so/api/v2/get_tx_unspent/LTCTEST/' + address
//             }
//             try {
//                 const result = await query('GET', URL[_Litecoin.network.current.name]);
//                 return result.data.txs;
//             } catch (e) {
//                 throw new Error('Can\'t get UTXO. Please, check your internet connection');
//             }
//         }
//     },
//     transactions: {
//         /**
//          * Allows to sign transaction
//          * @param {Array|String} privateKey
//          * @param {Array|String} to
//          * @param {Number} amount
//          * @param orderType Count of future outputs 1 or any
//          * @return {Promise<string>} Hex data of signed transaction
//          */
//         signTransaction: async (privateKey, to, amount, orderType = 'any') => {
//             if (isArray(privateKey) && hasDuplicates(privateKey))
//                 throw new Error('Private Keys cannot be duplicated');
//
//             const fee = _Litecoin.utils.fee;
//
//             const convertedArray = toArrays(privateKey, to, amount);
//             const arrays = convertedArray.arrays;
//             const _privateKey = arrays[0];
//             const _to = arrays[1];
//             const _amount = arrays[2];
//
//             if (isLengthError(convertedArray.maxLength, ...arrays))
//                 throw new Error(`Count of 'privateKey' is ${_privateKey.length}. Count of 'to' is ${_to.length}. Count of 'amount' is ${_amount.length}. But it should be equal.`);
//
//             const values = {};
//             const utxos = {};
//
//             for (let i in _privateKey) {
//                 const tx_value = _amount[i];
//                 const address = _Litecoin.account.getAddress(_privateKey[i]);
//                 if (utxos[address] === undefined)
//                     utxos[address] = await _Litecoin.balance.getUTXOs(address);
//                 values[address] !== undefined ? values[address] = tbn(values[address]).plus(tx_value).toNumber() : values[address] = tx_value;
//             }
//
//             for (let address in values) {
//                 const balance = await _Litecoin.balance.getBalance(address);
//                 const spendValue = tbn(values[address]).plus(fee);
//                 if (spendValue.gt(balance))
//                     throw new Error(`Sending value is ${_utils.fw(spendValue)}. Balance of ${address} is ${_utils.fw(balance)}`);
//             }
//
//             if (typeof privateKey === 'string' || (isArray(privateKey) && privateKey.length === 1)) {
//                 const __privateKey = new Litecore.PrivateKey(_privateKey[0]);
//                 const senderAddress = _Litecoin.account.getAddress(__privateKey);
//                 const tx = new Litecore.Transaction();
//                 let currentValue = 0;
//                 const totalValue = totalAmount(_amount);
//                 const inputs = utxos[senderAddress];
//                 for (let i in inputs) {
//                     const utxoValue = _utils.tw(inputs[i].value).toNumber();
//                     const input = {
//                         "txId": inputs[i].txid,
//                         "confirmations": inputs[i].confirmations,
//                         "vout": inputs[i].output_no,
//                         "address": senderAddress.toString(),
//                         "scriptPubKey": inputs[i].script_hex,
//                         "satoshis": utxoValue
//                     };
//                     tx.from(input);
//
//                     currentValue = tbn(currentValue).plus(utxoValue);
//                     if (isTxComplete(currentValue.toNumber(), totalValue))
//                         break;
//                 }
//                 _to.forEach((recieverAddress, index) => tx.to(recieverAddress, _amount[index]));
//                 tx.fee(_Litecoin.utils.fee);
//                 tx.change(senderAddress);
//                 tx.sign(__privateKey);
//                 return tx.toString();
//             }
//         },
//         /**
//          * Allows to send signed transaction to blockchain
//          * @param rawTransaction Hex data of signed transaction
//          * @return {Promise<*>} Object with tx hash
//          */
//         sendSigned: async (rawTransaction) => {
//             if (typeof rawTransaction != 'string')
//                 throw new Error('Signed transaction can be a string');
//             const URL = {
//                 livenet: 'https://chain.so/api/v2/send_tx/LTC',
//                 testnet: 'https://chain.so/api/v2/send_tx/LTCTEST',
//             };
//             const data =  `{\"tx_hex\":\"${rawTransaction}\"}`;
//             const response = await query('POST', URL[_Litecoin.network.current], data);
//             return response;
//         }
//     },
//     utils: {
//         fee: 100000,
//         change: (fee) => {
//             _Litecoin.utils.fee = fee;
//         }
//     }
// };
//
// const _BitcoinCash = {
//     network: {
//         change: (network) => {
//             const net = _BitcoinCash.network.current = _BitcoinCash.network[network];
//             if (!net)
//                 throw new Error(`Use 'mainnet' or 'testnet', not ''${network}''`);
//         },
//         current: BitcoinCash.Networks.testnet,
//         testnet: BitcoinCash.Networks.testnet,
//         mainnet: BitcoinCash.Networks.livenet,
//     },
//     account: {
//         /**
//          * Allows to create new private key
//          * @returns Private key
//          */
//         create: () => {
//             return new BitcoinCash.PrivateKey(_BitcoinCash.network.current).toString();
//         },
//         /**
//          * Allows to get address from private key
//          * @param privateKey
//          * @returns {*} Address
//          */
//         getAddress: (privateKey) => {
//             return new BitcoinCash.PrivateKey(privateKey).toAddress(_BitcoinCash.network.current).toString();
//         }
//     },
//     balance: {
//         /**
//          * Allows to get address balance
//          * @param address Address
//          * @returns {Promise<*>} Balance (don't forget about 1e18)
//          */
//         getBalance: async (address) => {
//             if (!BitcoinCash.Address.isValid(address))
//                 throw new Error('Entered address is invalid');
//             const toCashAddress = bchAddress.toCashAddress;
//             const URL = {
//                 livenet: 'https://bch-insight.bitpay.com/api/addr/' + toCashAddress(address),
//                 testnet: 'https://test-bch-insight.bitpay.com/api/addr/' + address
//             };
//             try {
//                 const result = await query('GET', URL[_BitcoinCash.network.current.name]);
//                 return result.balanceSat;
//             } catch (e) {
//                 throw new Error('Can\'t get the balance. Please, check your internet connection');
//             }
//         },
//         /**
//          * Allows to get all unspent transaction outputs
//          * @param address User address
//          * @return {Promise<*|Array>} Array of UTXOs
//          */
//         getUTXOs: async (address) => {
//             const URL = {
//                 livenet: 'https://blockdozer.com/api/addr/' + address + '/utxo',
//                 testnet: 'https://tbch.blockdozer.com/api/addr/' + address + '/utxo'
//             }
//             try {
//                 const result = await query('GET', URL[_BitcoinCash.network.current.name]);
//                 return result;
//             } catch (e) {
//                 throw new Error('Can\'t get UTXO. Please, check your internet connection');
//             }
//         },
//     },
//     transactions: {
//         /**
//          * Allows to sign transaction
//          * @param {Array|String} privateKey
//          * @param {Array|String} to
//          * @param {Number} amount
//          * @param orderType Count of future outputs 1 or any
//          * @return {Promise<string>} Hex data of signed transaction
//          */
//         signTransaction: async (privateKey, to, amount, orderType = 'any') => {
//             if (isArray(privateKey) && hasDuplicates(privateKey))
//                 throw new Error('Private Keys cannot be duplicated');
//
//             const fee = _BitcoinCash.utils.fee;
//
//             const convertedArray = toArrays(privateKey, to, amount);
//             const arrays = convertedArray.arrays;
//             const _privateKey = arrays[0];
//             const _to = arrays[1];
//             const _amount = arrays[2];
//
//             if (isLengthError(convertedArray.maxLength, ...arrays))
//                 throw new Error(`Count of 'privateKey' is ${_privateKey.length}. Count of 'to' is ${_to.length}. Count of 'amount' is ${_amount.length}. But it should be equal.`);
//
//             const values = {};
//             const utxos = {};
//
//             for (let i in _privateKey) {
//                 const tx_value = _amount[i];
//                 const address = _BitcoinCash.account.getAddress(_privateKey[i]);
//                 if (utxos[address] === undefined)
//                     utxos[address] = await _BitcoinCash.balance.getUTXOs(address);
//                 values[address] !== undefined ? values[address] = tbn(values[address]).plus(tx_value).toNumber() : values[address] = tx_value;
//             }
//
//             for (let address in values) {
//                 const balance = await _BitcoinCash.balance.getBalance(address);
//                 const spendValue = tbn(values[address]).plus(fee);
//                 if (spendValue.gt(balance))
//                     throw new Error(`Sending value is ${_utils.fw(spendValue)}. Balance of ${address} is ${_utils.fw(balance)}`);
//             }
//
//             if (typeof privateKey === 'string' || (isArray(privateKey) && privateKey.length === 1)) {
//                 const __privateKey = new BitcoinCash.PrivateKey(_privateKey[0]);
//                 const senderAddress = _BitcoinCash.account.getAddress(__privateKey);
//                 const tx = new BitcoinCash.Transaction();
//                 let currentValue = 0;
//                 const totalValue = totalAmount(_amount);
//                 const inputs = utxos[senderAddress];
//                 for (let i in inputs) {
//                     const utxoValue = _utils.tw(inputs[i].amount).toNumber();
//                     const input = {
//                         "txId": inputs[i].txid,
//                         "confirmations": inputs[i].confirmations,
//                         "vout": inputs[i].vout,
//                         "address": senderAddress.toString(),
//                         "scriptPubKey": inputs[i].scriptPubKey,
//                         "satoshis": utxoValue
//                     };
//                     tx.from(input);
//
//                     currentValue = tbn(currentValue).plus(utxoValue);
//                     if (isTxComplete(currentValue.toNumber(), totalValue))
//                         break;
//                 }
//                 _to.forEach((recieverAddress, index) => tx.to(recieverAddress, _amount[index]));
//                 tx.fee(_BitcoinCash.utils.fee);
//                 tx.change(senderAddress);
//                 tx.sign(__privateKey);
//                 return tx.toString();
//             }
//         },
//         /**
//          * Allows to send signed transaction to blockchain
//          * @param rawTransaction Hex data of signed transaction
//          * @return {Promise<*>} Object with tx hash
//          */
//         sendSigned: async (rawTransaction) => {
//             if (typeof rawTransaction != 'string')
//                 throw new Error('Signed transaction can be a string');
//             const URL = {
//                 livenet: 'https://bch-insight.bitpay.com/api/tx/send',
//                 testnet: 'https://test-bch-insight.bitpay.com/api/tx/send',
//             };
//             const data =  `{\"rawtx\":\"${rawTransaction}\"}`;
//             const response = await query('POST', URL[_BitcoinCash.network.current], data);
//             return response;
//         }
//     },
//     utils: {
//         fee: 100000,
//         change: (fee) => {
//             _BitcoinCash.utils.fee = fee;
//         }
//     }
// };
//
// const _Bitcoin = {
//     network: {
//         change: (network) => {
//             const net = _Bitcoin.network.current = _Bitcoin.network[network];
//             if (!net)
//                 throw new Error(`Use 'mainnet' or 'testnet', not ''${network}''`);
//         },
//         current: Bitcore.Networks.testnet,
//         testnet: Bitcore.Networks.testnet,
//         mainnet: Bitcore.Networks.livenet,
//     },
//     account: {
//         /**
//          * Allows to create new private key
//          * @returns Private key
//          */
//         create: () => {
//             return new Bitcore.PrivateKey(_Bitcoin.network.current).toString();
//         },
//         /**
//          * Allows to get address from private key
//          * @param privateKey
//          * @returns {*} Address
//          */
//         getAddress: (privateKey) => {
//             return new Bitcore.PrivateKey(privateKey).toAddress(_Bitcoin.network.current).toString();
//         }
//     },
//     balance: {
//         /**
//          * Allows to get address balance
//          * @param address Address
//          * @returns {Promise<*>} Balance (don't forget about 1e18)
//          */
//         getBalance: async (address) => {
//             if (!Bitcore.Address.isValid(address))
//                 throw new Error('Entered address is invalid');
//             const URL = {
//                 livenet: 'https://blockexplorer.com/api/addr/' + address,
//                 testnet: 'https://testnet.blockexplorer.com/api/addr/' + address
//             };
//             try {
//                 const result = await query('GET', URL[_Bitcoin.network.current.name]);
//                 return result.balanceSat;
//             } catch (e) {
//                 throw new Error('Can\'t get the balance. Please, check your internet connection');
//             }
//         },
//         /**
//          * Allows to get all unspent transaction outputs
//          * @param address User address
//          * @return {Promise<*|Array>} Array of UTXOs
//          */
//         getUTXOs: async (address) => {
//             const URL = {
//                 livenet: 'https://blockexplorer.com/api/addr/' + address + '/utxo',
//                 testnet: 'https://testnet.blockexplorer.com/api/addr/' + address + '/utxo'
//             }
//             try {
//                 const result = await query('GET', URL[_Bitcoin.network.current.name]);
//                 return result;
//             } catch (e) {
//                 throw new Error('Can\'t get UTXO. Please, check your internet connection');
//             }
//         }
//     },
//     transactions: {
//         /**
//          * Allows to sign transaction
//          * @param {Array|String} privateKey
//          * @param {Array|String} to
//          * @param {Number} amount
//          * @param orderType Count of future outputs 1 or any
//          * @return {Promise<string>} Hex data of signed transaction
//          */
//         signTransaction: async (privateKey, to, amount, orderType = 'any') => {
//             if (isArray(privateKey) && hasDuplicates(privateKey))
//                 throw new Error('Private Keys cannot be duplicated');
//
//             const fee = _Bitcoin.utils.fee;
//
//             const convertedArray = toArrays(privateKey, to, amount);
//             const arrays = convertedArray.arrays;
//             const _privateKey = arrays[0];
//             const _to = arrays[1];
//             const _amount = arrays[2];
//
//             if (isLengthError(convertedArray.maxLength, ...arrays))
//                 throw new Error(`Count of 'privateKey' is ${_privateKey.length}. Count of 'to' is ${_to.length}. Count of 'amount' is ${_amount.length}. But it should be equal.`);
//
//             const values = {};
//             const utxos = {};
//
//             for (let i in _privateKey) {
//                 const tx_value = _amount[i];
//                 const address = _Bitcoin.account.getAddress(_privateKey[i]);
//                 if (utxos[address] === undefined)
//                     utxos[address] = await _Bitcoin.balance.getUTXOs(address);
//                 values[address] !== undefined ? values[address] = tbn(values[address]).plus(tx_value).toNumber() : values[address] = tx_value;
//             }
//
//             for (let address in values) {
//                 const balance = await _Bitcoin.balance.getBalance(address);
//                 const spendValue = tbn(values[address]).plus(fee);
//                 if (spendValue.gt(balance))
//                     throw new Error(`Sending value is ${_utils.fw(spendValue)}. Balance of ${address} is ${_utils.fw(balance)}`);
//             }
//
//             if (typeof privateKey === 'string' || (isArray(privateKey) && privateKey.length === 1)) {
//                 const __privateKey = new Bitcore.PrivateKey(_privateKey[0]);
//                 const senderAddress = _Bitcoin.account.getAddress(__privateKey);
//                 const tx = new Bitcore.Transaction();
//                 let currentValue = 0;
//                 const totalValue = totalAmount(_amount);
//                 const inputs = utxos[senderAddress];
//                 for (let i in inputs) {
//                     const utxoValue = _utils.tw(inputs[i].amount).toNumber();
//                     const input = {
//                         "txId": inputs[i].txid,
//                         "confirmations": inputs[i].confirmations,
//                         "vout": inputs[i].vout,
//                         "address": senderAddress.toString(),
//                         "scriptPubKey": inputs[i].scriptPubKey,
//                         "satoshis": utxoValue
//                     };
//                     tx.from(input);
//
//                     currentValue = tbn(currentValue).plus(utxoValue);
//                     if (isTxComplete(currentValue.toNumber(), totalValue))
//                         break;
//                 }
//                 _to.forEach((recieverAddress, index) => tx.to(recieverAddress, _amount[index]));
//                 tx.fee(_Bitcoin.utils.fee);
//                 tx.change(senderAddress);
//                 tx.sign(__privateKey);
//                 return tx.toString();
//             }
//         },
//         /**
//          * Allows to send signed transaction to blockchain
//          * @param rawTransaction Hex data of signed transaction
//          * @return {Promise<*>} Object with tx hash
//          */
//         sendSigned: async (rawTransaction) => {
//             if (typeof rawTransaction != 'string')
//                 throw new Error('Signed transaction can be a string');
//             const URL = {
//                 livenet: 'https://insight.bitpay.com/api/tx/send',
//                 testnet: 'https://test-insight.bitpay.com/api/tx/send',
//             };
//             const data =  `{\"rawtx\":\"${rawTransaction}\"}`;
//             const response = await query('POST', URL[_Bitcoin.network.current], data);
//             return response;
//         }
//     },
//     utils: {
//         fee: 100000,
//         change: (fee) => {
//             _Bitcoin.utils.fee = fee;
//         }
//     }
// }

const isArray = (variable) => variable instanceof Array;
const toArray = (variable, length) => Array.from({length: length}, (v, k) => variable);
const toArrays = (...variables) => {
    const lengths = variables.map(elem => isArray(elem) ? elem.length : 1);
    const maxLength = lengths.reduce((acc, val) => val > acc ? val : acc, 0);
    const arrays = variables.map(elem => isArray(elem) ? elem : toArray(elem, maxLength));
    return {
        maxLength: maxLength,
        arrays: arrays
    };
};
const hasDuplicates = (array) => (new Set(array)).size !== array.length;
const isLengthError = (length, ...arrays) => arrays.reduce((acc, array) => acc === false && array.length === length ? false : true, false);
const isTxComplete = (utxoAmount, necessaryAmount) => utxoAmount >= necessaryAmount ? true : false;
const totalAmount = (amountArray) => amountArray.reduce((acc, val) => acc + val);
const isObject = (variable) => typeof variable == 'object';
const isNumber = (variable) => typeof variable == 'number';
const query = async (method, url, data) => {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "processData": false,
    };

    if (data) {
        settings.data = data;
        settings.headers = {
            "Content-Type": "application/json",
            // "Cache-Control": "no-cache"
        };
    }

    const result = await $.ajax(settings);
    return result;
};


const _utils = {
    course: {
        /**
         * Allows to get course
         * @param currency Currency, relative to which the course will be taken
         * @returns {Promise<*>} Object with exchange rates
         */
        getCourse: async (currency) => {
            const response = await $.get({
                url: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR,RUB`,
                type: 'GET',
            });
            return response;
        },
        /**
         * Allows to convert currencies
         * @param from Currency that will be changed
         * @param to Destination currency
         * @param value Amount of currency that will be changed
         * @returns {Promise<number>}
         */
        convert: async (from, to, value) => {
            const courses = await Course.getCourse(currency[from].ticker);
            const rate = courses[currency[to].ticker];
            const result = value * rate;
            return result * 1000 % 10 === 0 ? result : result.toFixed(2);
        }
    },
    /**
     * Convert Number (or BN) to this * 10^8
     * @param x Some number
     * @returns {*} Number * 10^8
     */
    tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e8).integerValue() : tbn(x).times(1e8).integerValue(),

    /**
     * Convert from minimal Waves unit
     * @param x Some number
     * @returns {*} Converted number
     */
    fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-8).toNumber() : tbn(x).times(1e-8).toNumber()
};



