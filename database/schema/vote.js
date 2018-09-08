const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Vote = new Schema({
    id: {
        type: String
    },
    name: {
      type: String
    },
    participants: {
        type: Array
    },
    answers: {
      type: Array
    },
    votes: {
        type: Object
    },
    end: {
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Vote', Vote);