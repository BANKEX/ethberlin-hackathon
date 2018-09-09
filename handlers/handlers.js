const db = require('./../database/database');
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

async function viewMyVotes(ctx) {
    const votes = await db.vote.getByUserId(ctx.from.id);
    if (votes.length === 0) {
        ctx.reply(Text.viewVotes.no_votes);
        return;
    }
    const voteId = votes[0].votes;
    const inline_keyboard = [];
    for (let i = 0; i < voteId.length; i++) {
        const vote = await db.vote.getByVoteId(voteId[i]);
        inline_keyboard.push(Markup.callbackButton(vote[0].name, "voteName:" + vote[0].name));
    };
    const keyboard = Markup.inlineKeyboard(inline_keyboard).extra();
    ctx.telegram.sendMessage(
        ctx.from.id,
        Text.keyboard_text.myVotes,
        keyboard)
}

async function viewNotMyVotes(ctx) {
    const votes = await db.vote.getByTakePartUserId(ctx.from.id);
    if (votes.length === 0) {
        ctx.reply(Text.viewVotes.no_votes);
        return;
    }
    const voteId = votes[0].votes;
    const inline_keyboard = [];
    for (let i = 0; i < voteId.length; i++) {
        const vote = await db.vote.getByVoteId(voteId[i]);
        console.log(vote)
        inline_keyboard.push(Markup.callbackButton(vote[0].name, "voteName:" + vote[0].name));
    };
    const keyboard = Markup.inlineKeyboard(inline_keyboard).extra();
    ctx.telegram.sendMessage(
        ctx.from.id,
        Text.keyboard_text.myVotes,
        keyboard)
}

async function votes(ctx) {
    const reg = ctx.callbackQuery.data.split('voteName:');
    if (reg.length > 1) {
        const voteName = reg[1];
        const votes = await db.vote.getAll();
        for (let i = 0; i < votes.length; i++) {
            if (votes[i].name === voteName) {
                let participants = '';
                for (let j = 0; j < votes[i].participants.length; j++)
                    participants += (`${j+1} ${votes[i].participants[j]}\n`);
                let text = "*Participants:* \n" + participants + "\n*Results*\n";
                const obj = {};
                for (let k = 0; k < votes[i].answers.length; k++)
                    obj[votes[i].answers[k]] = 0;
                for (let h = 0; h < votes[i].votes.length; h++)
                    obj[votes[i].votes[h].answer] += 1;
                for (let o in obj)
                    text += ("*"+o+":* " + obj[o] + "\n");
                ctx.replyWithMarkdown(text);
            }
        }
    } else if (ctx.callbackQuery.data.split('vote:').length > 1) {
        const voteId = ctx.callbackQuery.data.split('vote:')[1];
        const vote = await db.vote.getByVoteId(voteId);
        const answers = vote[0].answers;
        const inline_keyboard = [];
        for (let i = 0; i < answers.length; i++)
            inline_keyboard.push([Markup.callbackButton(answers[i], vote[0].id + "?vote_answer:" + answers[i])]);
        const keyboard = Markup.inlineKeyboard(inline_keyboard).extra();
        ctx.telegram.sendMessage(
            ctx.from.id,
            Text.vote.choose_answer,
            keyboard)
    } else if (ctx.callbackQuery.data.split('?vote_answer:').length > 1) {
        game = 'signanswer';
        answer = ctx.callbackQuery.data.split('?vote_answer:')[1];
        db.vote.vote(ctx.from.id, ctx.from.username, ctx.callbackQuery.data.split('?vote_answer:')[0], answer);
        replyGame(ctx, 'signanswer', Keyboard.sign);
    }
}

async function vote(ctx) {
    const votes = await db.vote.getAll();
    const i_can_take_part_in_this_votes = [];
    for (let i = 0; i < votes.length; i++)
        for (let j = 0; j < votes[i].participants.length; j++)
            if (ctx.from.username === votes[i].participants[j])
                i_can_take_part_in_this_votes.push(votes[i]);
    if (i_can_take_part_in_this_votes.length === 0) {
        ctx.reply(Text.vote.no_votes);
        return;
    }
    const inline_keyboard = [];
    for (let i = 0; i < i_can_take_part_in_this_votes.length; i++)
        inline_keyboard.push(Markup.callbackButton(i_can_take_part_in_this_votes[i].name, "vote:" + i_can_take_part_in_this_votes[i].id));
    const keyboard = Markup.inlineKeyboard(inline_keyboard).extra();
    ctx.telegram.sendMessage(
        ctx.from.id,
        Text.vote.choose_vote,
        keyboard)
}

function viewVotes(ctx) {
    return ctx.reply(Text.keyboard_text.viewVotes, Markup
        .keyboard(Keyboard.viewVotes)
        .resize()
        .extra()
    )
}

let game = '';
let answer = '';

const games = (ctx) => {
    if (game !== 'signanswer')
        ctx.answerGameQuery('http://23.100.12.138:3000/'+ctx.from.id+'/keys.html');
    else
        ctx.answerGameQuery('http://23.100.12.138:3000/'+answer+'/sign.html');
}

const replyGame = (ctx, gameShortName, markup) => ctx.replyWithGame(gameShortName, markup);

module.exports = {
    start: start,
    games: games,
    getParticipants: getParticipants,
    getName: getName,
    getAnswers: getAnswers,
    viewVotes: viewVotes,
    viewMyVotes: viewMyVotes,
    viewNotMyVotes: viewNotMyVotes,
    vote: vote,
    votes: votes
}