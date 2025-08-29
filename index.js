import dotenv from 'dotenv';
import cron from 'node-cron';
import { Client, GatewayIntentBits } from'discord.js';
import {dailyAnniversaryCheck, anniversaryCommand} from './modules/anniversary.js';

dotenv.config();


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,    // Add temporarily for testing
        GatewayIntentBits.MessageContent    // Add temporarily for testing
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
    // Schedule a task to run every day at noon
    cron.schedule('0 12 * * *', async () => dailyAnniversaryCheck(client));
    // Testing for every minute
    // cron.schedule('* * * * *', async () => dailyAnniversaryCheck(client));        
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    if (message.content === '!test') {
        message.reply('Bot is working!');
    }
    
    if (message.content === '!anniversary') {
        try {
            anniversaryCommand(message);
        } catch (error) {
            console.error('Error:', error);
            message.reply('Could not fetch Discord anniversaries.');
        }
    }

    if (message.content === '!anniversarytest') {
        try {
            anniversaryCommand(message, true);
        } catch (error) {
            console.error('Error:', error);
            message.reply('Could not fetch Discord anniversaries.');
        }
    }
});


client.login(process.env.DISCORD_TOKEN);