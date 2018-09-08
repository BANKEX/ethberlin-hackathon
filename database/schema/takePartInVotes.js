const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TakePartInVotes = new Schema({
    userId: {
        type: String
    },
    votes: {
        type: Array
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('TakePartInVotes', TakePartInVotes);