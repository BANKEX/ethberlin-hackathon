const mongoose = require('mongoose')

let ValueSchema = new mongoose.Schema(
    {
        value: Number,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        snark: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Snark'
        }
    }
);
ValueSchema.methods.addAuthor = function (author_id) {
    this.author = author_id
    return this.save()
}
ValueSchema.methods.addSnark = function (snark_id) {
    this.snark = snark_id
    return this.save()
}
ValueSchema.methods.getSnarkValue = function (_id) {
    Value.find({'snark': _id}).then((value) => {
        return value
    })
}
module.exports = mongoose.model('Values', ValueSchema)