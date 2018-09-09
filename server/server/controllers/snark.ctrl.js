const fs = require('fs');
const child = require('child_process');

module.exports = {
    createInput:(data, next)=>{
        //pass data to python script
        var dir=__dirname.replace('server/server/models','pysigner')
        var messageFile=dir+'/data/input_snark.jsonnpm i web3';

        fs.writeFile(messageFile, JSON.stringify( data ), function (err) {
            if (err) return console.log(err);
            var pythonScript = child.execFile(dir+'/curvetool.py',
                [ "gencert", messageFile ], function(err, stdout, stderr) {
                    if (err) return console.log(err);
                    console.log(stdout);
                    //read data from result file and pass to the next function
                    next(data);
                });

        });
    },
    generateSnark:(data, next)=>{
        //pass data to cpp lib
        var dir=__dirname.replace('server/server/models','pysigner')
        var messageFile=dir+'/data/input_snark.txt';

        fs.writeFile(messageFile, JSON.stringify( data ), function (err) {
            if (err) return console.log(err);
            var pythonScript = child.execFile(dir+'/curvetool.py',
                [ "gencert", messageFile ], function(err, stdout, stderr) {
                    if (err) return console.log(err);
                    console.log(stdout);
                    //read data from result file and pass to the next function
                    next(data);
                });

        });
    }

}