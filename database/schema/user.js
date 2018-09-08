const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    userId: {
        type: String
    },
    publicKey: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);