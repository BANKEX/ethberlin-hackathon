const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserVotes = new Schema({
    userId: {
        type: String
    },
    votes: {
        type: Array
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('UserVotes', UserVotes);