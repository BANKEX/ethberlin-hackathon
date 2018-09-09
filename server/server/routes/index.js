
const vote = require('./vote')
const contract = require('./contract')

module.exports = (router) => {
    contract(router)
    vote(router)
}