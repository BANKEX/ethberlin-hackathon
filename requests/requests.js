

const rp = require('request-promise');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN;

function sendKeyboard(userId, text, keyboard) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot'+TOKEN+'/sendMessage',
        body: {
            'chat_id': userId,
            'text': text,
            'parse_mode': 'HTML',
            'reply_markup': JSON.stringify({
                "keyboard": keyboard,
                "resize_keyboard": true
            }),
            'disable_web_page_preview': true
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp.post(options);
}

module.exports = {
    sendKeyboard: sendKeyboard
}