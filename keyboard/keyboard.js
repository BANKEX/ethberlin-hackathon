const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('./../text.json');

const main = [
    [Text.button.main["0"], Text.button.main["1"]],
    [Text.button.main["2"]],
    [Text.button.main["3"]]
];

const viewVotes = [
    [Text.button.viewVotes["0"], Text.button.viewVotes["1"]],
    [Text.back],
];

const keypair = Extra.markup(
    Markup.inlineKeyboard([
        Markup.gameButton(Text.gameButton.keypair),
    ])
    );

module.exports = {
    main: main,
    keypair: keypair,
    viewVotes: viewVotes
}