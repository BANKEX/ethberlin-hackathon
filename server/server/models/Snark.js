const mongoose = require('mongoose')

let SnarkSchema = new mongoose.Schema(
    {
        func: String,
        address: String
    }
)
module.exports = mongoose.model('Snark', SnarkSchema)