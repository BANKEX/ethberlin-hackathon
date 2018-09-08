const mongoose = require('mongoose');
const bn = require('bn.js');
const fs = require('fs');
const child = require('child_process');

let ContractSchema = new mongoose.Schema(
    {
        value: Number,
        answer: Number,
        name: String,
        m: String
    }
);

module.exports = mongoose.model('Contract', ContractSchema)
