

var Verifier = artifacts.require("./Verifier.sol");
var TrustedResource = artifacts.require("./TrustedResource.sol");

var vk = require('../zksnark_element/keys.json');
var proof = require('../zksnark_element/proof.json');


var fs = require("fs");



module.exports = function(deployer, network, accounts) {

  (async () => {
      deployer.then(async function() {
          let verifier = await Verifier.new(
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
            vk.IC);

            let trust = await TrustedResource.new(
              verifier.address, "100000000", "30"
            );
    
            console.log(verifier.address, trust.address);
            await fs.writeFile("address.txt", trust.address, "utf8");


            
            await trust.submit(
              proof.a,
              proof.a_p,
              proof.b,
              proof.b_p,
              proof.c,
              proof.c_p,
              proof.h,
              proof.k,
              proof.input, {value:"200000000"});



      });
  })();
};



// get verifcation key, proving key 