const user = require('./user')
const article = require('./article')
const value = require('./value')
const snark = require('./snark')

module.exports = (router) => {
    user(router)
    article(router)
    snark(router)
    value(router)
}