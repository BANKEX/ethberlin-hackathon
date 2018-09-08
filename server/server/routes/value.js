const valuecontroller = require('./../controllers/value.ctrl')

module.exports = (router) => {

    /**
     * get a user
     */
    router
        .route('/value/:id')
        .get(valuecontroller.getValue)

    /**
     * adds a user
     */
    router
        .route('/value')
        .post(valuecontroller.addValue)
}