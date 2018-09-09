const contractcontroller = require('./../controllers/contract.ctrl')

module.exports = (router) => {
    router
        .route('/vote')
        .get(contractcontroller.getValue)
}