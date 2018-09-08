const db = require('./../database/database');
const keyboards = require('./../requests/keyboards/keyboards');
const request = require('./../requests/requests');

function createUser(req, res) {
    const body = req.params;
    db.user.create(body.userId, body.publicKey);
    request.sendKeyboard(body.userId, '👾 Now you can create vote or take part in vote!', keyboards.main);
    res.end();
}

module.exports = {
    createUser: createUser
}