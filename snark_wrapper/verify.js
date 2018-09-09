var Web3 = require('web3');
var Solidity = require('solc')
var fs = require("fs");
var BigNumber = require('bignumber.js');

// get verifcation key, proving key 
var proof = require('./zksnark_element/proof.json');


var code = fs.readFileSync("./contracts/TrustedResource.sol", "utf8");
var address = fs.readFileSync("address.txt", "utf8");
var compiled = Solidity.compile(code, 1)

var bytecode = compiled.contracts[":TrustedResource"].bytecode;
var abi = compiled.contracts[":TrustedResource"].interface;
var abi = JSON.parse(abi);
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
}
 

var TrustedResource = web3.eth.contract(abi);
TrustedResource_deployed = TrustedResource.at(address);
TrustedResource_deployed.submit.sendTransaction(
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


