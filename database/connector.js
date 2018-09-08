const mongoose = require("mongoose");
require('dotenv').config();

const username = process.env.LOGIN;
const password = process.env.PASSWORD;
const url = process.env.URL;
const dataBase = process.env.DB;

const uri = `mongodb://${username}:${password}@${url}/${dataBase}`;

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 1000,
    bufferMaxEntries: 0,
    useNewUrlParser: true
};

const db = mongoose.connect(uri, options).then(a=> console.log('Mongo DB works fine'));