const db = require('./../database/database');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');

async function start(ctx) {
    const user = await db.user.get(ctx.from.id);
    if (user.length > 0)
        return ctx.reply(Text.keyboard_text.main, Markup
            .keyboard(Keyboard.main)
            .resize()
            .extra()
        )
    else
        replyGame(ctx, Text.games.keypair, Keyboard.keypair);

}

const names = {};
const participants = {};

function getName(ctx) {
    names[ctx.from.id] = ctx.state.data;
    ctx.replyWithMarkdown(Text.createVote.participants);
}

function getParticipants(ctx) {
    participants[ctx.from.id] = ctx.state.data;
    ctx.replyWithMarkdown(Text.createVote.answers);
}

function getAnswers(ctx) {
    const userId = ctx.from.id;
    const answers = ctx.state.data;
    ctx.replyWithMarkdown(Text.createVote.end);
    createVote(userId, names[userId], participants[userId], answers);
}

function createVote(userId, name, participants, answers) {
    const _participants = participants.split(',');
    const _answers = answers.split(',');
    db.vote.create(userId, name, _participants, _answers);
}

function viewVotes(ctx) {
    return ctx.reply(Text.keyboard_text.viewVotes, Markup
        .keyboard(Keyboard.viewVotes)
        .resize()
        .extra()
    )
}

const keyPairGame = (ctx) => ctx.answerGameQuery('http://23.100.12.138:3000/'+ctx.from.id+'/keys.html');

const replyGame = (ctx, gameShortName, markup) => ctx.replyWithGame(gameShortName, markup);

module.exports = {
    start: start,
    keyPairGame: keyPairGame,
    getParticipants: getParticipants,
    getName: getName,
    getAnswers: getAnswers,
    viewVotes: viewVotes
}