const Router = require('telegraf/router');

const createVote = new Router((ctx) => {
    const trigger = ctx.message.text.split(':');
    return {
        route: trigger[0],
        state: {
            data: trigger[1]
        }
    };
});

module.exports = {
    createVote: createVote
}

