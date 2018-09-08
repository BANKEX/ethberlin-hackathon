var Web3 = require('web3');
var Solidity = require('solc')
var fs = require("fs");
var BigNumber = require('bignumber.js');

// get verifcation key, proving key 
var vk = require('./zksnark_element/vk.json');


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
     from: web3.eth.accounts[1], 
     data: bytecode, 
     gas: '4700000',
     abi: abi
   });
  
   
   var storageAddress = (await web3.eth.getTransactionReceipt(snark_deployed.transactionHash)).contractAddress;
   fs.writeFileSync("address.txt", storageAddress, "utf8");
  
})();
