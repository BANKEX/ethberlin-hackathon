const contractcontroller = require('./../controllers/contract.ctrl')

module.exports = (router) => {
    router
        .route('/contract')
        .get(contractcontroller.getValue)
}