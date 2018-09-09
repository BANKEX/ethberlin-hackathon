/** */
var fs = require("fs");

const child = require('child_process');

module.exports = {
    getValue: (req, res, next) => {
       //возвращаю данные из indata.txt
        var dir=__dirname.replace('server/server/controllers','snark_wrapper');
        var inputFile=dir+'/indata.txt';

        fs.readFile(inputFile, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send("5");
            next(data);
        });
    },
    deploy: (next) => {
        //execute truffle copy-past
        var dir=__dirname.replace('controllers','snark_wrapper');
        console.log("[bankend] deploying and verifying in porogress");

        var truffleScript = child.exec('truffle migrate --network rinkeby --reset', {cwd: dir},
             function(err, stdout, stderr) {
                if (err) return console.log(err, stdout, stderr);
                next();
            });

    },
    checkData: () =>{
        var dir=__dirname.replace('controllers','snark_wrapper');
        console.log("[bankend] cheking data");

        var truffleScript = child.exec('truffle migrate --network rinkeby --reset -f 3', {cwd: dir},
             function(err, stdout, stderr) {
                if (err) return console.log(err);
                 var dir=__dirname.replace('server/server/controllers','snark_wrapper');
                 var inputFile=dir+'/indata.txt';

                 fs.readFile(inputFile, 'utf8', function (err, data) {
                     if (err) {
                         console.log(err);
                         res.send(err);
                     }
                     console.log("[backend] result is "+data);
                 });
            });
    }
}