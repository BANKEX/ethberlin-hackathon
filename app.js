const Telegraf = require('telegraf');
const session = require('telegraf/session')
const Handlers = require('./handlers/handlers');
const Routers = require('./routers/routers');
const Text = require('./text');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }))
bot.hears(/start/i, (ctx) => Handlers.start(ctx));

bot.gameQuery((ctx) => Handlers.keyPairGame(ctx))

Routers.createVote.on('-name', (ctx) => Handlers.getName(ctx));

Routers.createVote.on('-participants', (ctx) => Handlers.getParticipants(ctx));

Routers.createVote.on('-answers', (ctx) => Handlers.getAnswers(ctx));

Routers.createVote.otherwise((ctx) => ctx.replyWithMarkdown(Text.createVote.name));

bot.hears(Text.button.main["1"], Routers.createVote);
bot.hears(/-\w/i, Routers.createVote);

bot.hears(Text.button.main["0"], (ctx) => Handlers.viewVotes(ctx));

bot.hears(Text.back, (ctx) => Handlers.start(ctx));

bot.startPolling();
