/** */
var Web3 = require('web3');
var Solidity = require('solc')
var fs = require("fs");
var BigNumber = require('bignumber.js');
const Contract = require('./../models/Contract')

module.exports = {
    getValue: (req, res, next) => {
        res.send(value);
        next();
        // Value.find({}).then
        // /*populate('following').exec*/((err, value)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!value)
        //         res.send(404)
        //     else
        //         res.send(value)
        //     next()
        // })
    },
    deploy: (next) => {
        // get verifcation key, proving key
        var vk = require('./zksnark_element/keys.json');


        var code = fs.readFileSync("./contracts/contract.sol", "utf8");
        var compiled = Solidity.compile(code, 1)

        var bytecode = compiled.contracts[":Verifier"].bytecode;
        var abi = compiled.contracts[":Verifier"].interface;
        var abi = JSON.parse(abi);
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }


        (async function() {
            var snark = web3.eth.contract(abi);
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
                    from: web3.eth.accounts[1],
                    data: bytecode,
                    gas: '4700000',
                    abi: abi
                });


            var storageAddress = (await web3.eth.getTransactionReceipt(snark_deployed.transactionHash)).contractAddress;
            fs.writeFileSync("address.txt", storageAddress, "utf8");
        });
    },
    verify: (next) =>{
        // get verifcation key, proving key
        var proof = require('./zksnark_element/proof.json');


        var code = fs.readFileSync("./contracts/contract.sol", "utf8");
        var address = fs.readFileSync("address.txt", "utf8");
        var compiled = Solidity.compile(code, 1)

        var bytecode = compiled.contracts[":Verifier"].bytecode;
        var abi = compiled.contracts[":Verifier"].interface;
        var abi = JSON.parse(abi);
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

        var snark = web3.eth.contract(abi);
        snark_deployed = snark.at(address);
        console.log(snark_deployed.verifyTx.call(
            proof.a,
            proof.a_p,
            proof.b,
            proof.b_p,
            proof.c,
            proof.c_p,
            proof.h,
            proof.k,
            proof.input,
            {from:web3.eth.accounts[1], gas:2000000}));
    }
}