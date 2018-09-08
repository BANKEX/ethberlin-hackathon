const mongoose = require('mongoose');
const bn = require('bn.js');
const fs = require('fs');
const child = require('child_process');

let ValueSchema = new mongoose.Schema(
    {
        value: Number,
        vote: Number,
        name: String,
        m: String
    }
);
ValueSchema.methods.generateM = function () {
    var rand =new bn(this.name, 16);
    this.m="0".repeat(64-rand.length)+rand;
}
ValueSchema.methods.signing = function () {
    //save to file and then launch python script
    var dir=__dirname.replace('server/server/models','pysigner')
    var messageFile=dir+'/data/'+this.vote+'_'+this.name+'.txt';

    fs.writeFile(messageFile, JSON.stringify( this ), function (err) {
        if (err) return console.log(err);
        var pythonScript = child.execFile(dir+'/curvetool.py',
            [ "gencert", messageFile ], function(err, stdout, stderr) {
                if (err) return console.log(err);
                console.log(stdout);
            });

    });

}

module.exports = mongoose.model('Values', ValueSchema)
