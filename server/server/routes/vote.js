const votecontroller = require('./../controllers/vote.ctrl')

module.exports = (router) => {
    router
        .route('/vote/:id')
        .get(votecontroller.getVote)

    router
        .route('/vote')
        .get(votecontroller.getAllVote)
}