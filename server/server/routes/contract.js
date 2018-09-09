const contractcontroller = require('./../controllers/contract.ctrl')

module.exports = (router) => {
    router
        .route('/vote/:id')
        .get(contractcontroller.getValue)
}