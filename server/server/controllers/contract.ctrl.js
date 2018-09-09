/** */
var fs = require("fs");

const proof = require('../assets/zksnark_element/proof.json');
const vk = require('../assets/zksnark_element/keys.json');

//Provider Engine sub-modules

const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')

//EthereumJS Wallet Sub-Provider

const WalletSubprovider = require('ethereumjs-wallet/provider-engine')
const walletFactory = require('ethereumjs-wallet')

//Web3 Module

const Web3 = require('web3')

const Solidity = require('solc')

const env = process.env;

// don't load .env file in prod
if (env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

module.exports = {
    getValue: (req, res, next) => {
        // var dir=__dirname.replace('controllers','assets/contract')
        // var code = fs.readFileSync(dir+"/TrustedResource.sol", "utf8");
        // var compiled = Solidity.compile(code, 1)
        //
        // var nodeUrl="http://localhost:8545";
        //
        // var bytecode = compiled.contracts[":Verifier"].bytecode;
        // var abi = compiled.contracts[":Verifier"].interface;
        // var abi = JSON.parse(abi);
        // if (typeof web3 !== 'undefined') {
        //     web3 = new Web3(web3.currentProvider);
        // } else {
        //     // set the provider you want from Web3.providers
        //     web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
        // }
        //
        // var snark = web3.eth.contract(abi);
        // snark_deployed = snark.at(address);
        // var result=snark_deployed.trustedInput.call();
        // console.log('[backend] result of deploing contact ' + result);
        res.send("5");
        next(result);
    },
    deploy: (nodeUrl, next) => {
        var dir=__dirname.replace('controllers','assets/contract')
        var code = fs.readFileSync(dir+"/TrustedResource.sol", "utf8");
        var compiled = Solidity.compile(code, 1)

        var bytecode = compiled.contracts[":Verifier"].bytecode;
        var abi = compiled.contracts[":Verifier"].interface;
        var abi = JSON.parse(abi);
        if (typeof web3 !== 'undefined') {
            console.log('web3 underfined')
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            console.log('web3 create locals')
            //web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'))
            web3 = new Web3(new Web3.providers.HttpProvider('ws://138.201.136.25:8556'))
            // web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
        }

        var verifierAddress="";

        (async function() {

            var myAddress=env.ADDRESS;
            console.log(myAddress);

            var snark =  web3.eth.contract(abi);
            var snark_deployed = await snark.new(
                vk.a[0],
                vk.a[1],
                vk.b,
                vk.c[0],
                vk.c[1],
                vk.g[0],
                vk.g[1],
                vk.gb1,
                vk.gb2[0],
                vk.gb2[1],
                vk.z[0],
                vk.z[1],
                vk.IC,
                {
                    from: myAddress,
                    data: bytecode,
                    gas: '47000000'//,
                    //abi: abi
                });

            verifierAddress = (await web3.eth.getTransactionReceipt(snark_deployed.transactionHash),(verValue)=>{
                console.log("[bakend] verifyAdress "+value.contractAddress);
                var compiled = Solidity.compile(code, 1)

                var bytecode = compiled.contracts[":TrustedResource"].bytecode;
                var abi = compiled.contracts[":TrustedResource"].interface;
                var abi = JSON.parse(abi);


                var trustedResourceAddress="";
                (async function() {

                    var trust =  web3.eth.contract(abi);
                    var trust_deployed = await trust.new(verValue.contractAddress, "100000000", "30",
                        {
                            from: web3.eth.accounts[1],
                            data: bytecode,
                            gas: '4700000',
                            abi: abi
                        });


                    trustedResourceAddress = (await web3.eth.getTransactionReceipt(trust_deployed.transactionHash, (value)=>{
                        fs.writeFileSync(dir+"/address.txt", value.contractAddress, "utf8");
                        console.log("[bakend] inside "+value.contractAddress);
                        next(value.contractAddress)
                    })).contractAddress;


                })();
            });
        })();



    },
    verify: (nodeUrl, address, next) =>{
//Wallet Initialization

        var privateKey = "3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266"
        var privateKeyBuffer = new Buffer(privateKey, "hex")
        var myWallet = walletFactory.fromPrivateKey(privateKeyBuffer)

//Engine initialization & sub-provider attachment

        var engine = new ProviderEngine();

        engine.addProvider(new FixtureSubprovider({
            web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
            net_listening: true,
            eth_hashrate: '0x00',
            eth_mining: false,
            eth_syncing: true,
        }))

// cache layer
        engine.addProvider(new CacheSubprovider())

// filters
        engine.addProvider(new FilterSubprovider())

// pending nonce
        engine.addProvider(new NonceSubprovider())

// vm
        engine.addProvider(new VmSubprovider())

// Here the URL can be your localhost for TestRPC or the Infura URL
        engine.addProvider(new RpcSubprovider({
            //rpcUrl: 'https://mainnet.infura.io/'+env.INFURA_TOKEN,
            rpcUrl:'https://rinkeby.infura.io/b4nw7VFnaEUsWzyVKun8'
        }))

// Wallet Attachment
        engine.addProvider(new WalletSubprovider(myWallet))

// network connectivity error
        engine.on('error', function(err){
            // report connectivity errors
            console.error(err.stack)
        })

// start polling for blocks
        engine.start()

//Actual Initialization of the web3 module

        var web3 = new Web3(engine)

// get verifcation key, proving key

        var dir=__dirname.replace('controllers','assets/contract')
        var code = fs.readFileSync(dir+"/TrustedResource.sol", "utf8");
        var address = fs.readFileSync(dir+"/address.txt", "utf8");
        var compiled = Solidity.compile(code, 1)

        var bytecode = compiled.contracts[":TrustedResource"].bytecode;
        var abi = compiled.contracts[":TrustedResource"].interface;
        var abi = JSON.parse(abi);
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            //web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
            web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'))
            // web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
        }


        var TrustedResource = web3.eth.contract(abi);
        TrustedResource_deployed = TrustedResource.at(address);
        var result = TrustedResource_deployed.submit.sendTransaction(
            proof.a,
            proof.a_p,
            proof.b,
            proof.b_p,
            proof.c,
            proof.c_p,
            proof.h,
            proof.k,
            proof.input,
            {from:web3.eth.accounts[1], gas:2000000, value:"200000000"});
        console.log('[backend] result of verifying contact ' + result);
        next(result);
    }
}