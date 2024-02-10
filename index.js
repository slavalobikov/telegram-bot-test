const TelegramApi = require('node-telegram-bot-api')
const {parsed: {TELEGRAM_TOKEN}} = require('dotenv').config();
const {againOptions, gameOptions} = require('./options')

const token = TELEGRAM_TOKEN

const bot = new TelegramApi(token, {polling: true})



const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I guessed a number from 0 to 9, guess)')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId,'Try to guess!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'say hello'},
        {command: '/info', description: 'get info'},
        {command: '/game', description: 'try to guess number '}
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id

        console.log('msg', msg)


        await bot.sendMessage('673119401', `${msg.from.first_name}`)

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://telegramchannels.me/storage/stickers/prosekaihatsunemiku/big_prosekaihatsunemiku_1.png')
            return  bot.sendMessage(chatId, `Hello world`)
        }

        if (text === '/info') {
            return  bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from?.last_name || ''}`)
        }

        if (text === '/game') {
            return await startGame(chatId)

        }

        return bot.sendMessage(chatId, 'Write only commands')


    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
             return await startGame(chatId)
        }

        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId,'You win', againOptions)
        } else {
            return await bot.sendMessage(chatId,`You lose! The correct number was ${chats[chatId]}`, againOptions)
        }
    })
}

start()
