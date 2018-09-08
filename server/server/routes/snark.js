const snarkcontroller = require('./../controllers/snark.ctrl')

module.exports = (router) => {

    /**
     * get a user
     */
    router
        .route('/snark/:id')
        .get(snarkcontroller.getSnark)

    /**
     * adds a user
     */
    router
        .route('/snark')
        .post(snarkcontroller.addSnark)
}