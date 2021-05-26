const { Client , Intents } = require('discord.js');
const fs = require('fs');

const setting = require('./setting.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

module.exports.getClient = () => client;

const handler = {};

const debug = process.argv[2] == '--debug';
if(debug && !process.argv[3]) {
    console.error('Debug guild missing');
    process.exit(1);
}

client.once('ready', async () => {
    console.log(`${client.user.tag}으로 로그인하였습니다.`);

    const commands = [];
    fs.readdirSync('./commands').forEach(c => {
        const module = require(`./commands/${c}`);
        handler[module.info.name] = module.handler;
        commands.push(module.info);
    });

    if(debug) client.guilds.cache.get(process.argv[3]).commands.set(commands);
    else client.application.commands.set(commands);
});

client.on('interaction', async interaction => {
    if(!interaction.isCommand()) return;

    if(handler[interaction.commandName] != null) handler[interaction.commandName](interaction, client);
});

client.login(setting.TOKEN);