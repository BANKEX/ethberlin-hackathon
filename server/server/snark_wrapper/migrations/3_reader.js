


var TrustedResource = artifacts.require("./TrustedResource.sol");


var fs = require("fs");



module.exports = function(deployer, network, accounts) {

  (async () => {
    var address = fs.readFileSync("address.txt", "utf8");
    let trust = TrustedResource.at(address);
    let indata = await trust.trustedInput();
    fs.writeFileSync("indata.txt", JSON.stringify(indata), "utf8");
  })();
};



// get verifcation key, proving key 