const fs = require('fs');
const child = require('child_process');

module.exports = {
    createInput:(data, next)=>{
        //pass data to python script
        var dir=__dirname.replace('server/server/controllers','pysigner')
        var messageFile=dir+'/data/input_snark.json';

        fs.writeFile(messageFile, JSON.stringify( data ), function (err) {
            if (err) return console.log(err);
            //stub while curvetool doesn't work
           // var pythonScript = child.execFile(dir+'/curvetool.py',
            // [ "gencert", messageFile ], function(err, stdout, stderr) {
            var pythonScript = child.execFile(dir+'/./generatetestdata.py',
                 [], function(err, stdout, stderr) {
                    if (err) return console.log(err);
                    //read data from result file and pass to the next function

                    var dir=__dirname.replace('server/server/controllers','build/baby_jubjub_ecc');
                    var inputFile=dir+'/inputs.txt';

                    messageFile.replace('/data/input_snark.json','input.txt');
                    fs.createReadStream(messageFile).pipe(fs.createWriteStream(inputFile));

                    next();
                });
        });
    },
    generateSnark:(next)=>{
        //pass data to cpp lib
        var dir=__dirname.replace('server/server/controllers','build/baby_jubjub_ecc');
        var inputFile=dir+'/inputs.txt';

        console.log("[backend] start generating");
            var cppScript = child.execFile(dir+'/main',
                [ ], function(err, stdout, stderr) {
                    if (err) return console.log(err);
                    console.log(stdout);
                    //copy proof json and keys json
                    var assetDir=__dirname.replace('server/server/controllers','snark_wrapper/zksnark_element');
                    fs.createReadStream(dir+"/proof.json").pipe(fs.createWriteStream(assetDir+'/proof.json'));
                    fs.createReadStream(dir+"/keys.json").pipe(fs.createWriteStream(assetDir+'/keys.json'));
                    next();
                });

    }

}