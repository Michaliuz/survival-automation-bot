const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, REST, Routes, ActivityType, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// =============== CONFIGURATION ===============
let config;
try {
    config = require('./config.json');
} catch (error) {
    config = { 
        prefix: '!', 
        enablePrefix: true,
        botName: 'Survival Automation',
        version: '1.0.0'
    };
}

const PREFIX = config.prefix;

// =============== CLIENT SETUP ===============
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

// =============== GLOBAL STORAGE ===============
global.autoReactChannels = global.autoReactChannels || {
    intro: null,
    music: null,
    art: null,
    announcement: null,
    collab: null
};

global.botStatus = {
    currentIndex: 0,
    statuses: [
        { type: ActivityType.Listening, text: 'Survival Automation' },
        { type: ActivityType.Playing, text: 'with Music Producers' },
        { type: ActivityType.Watching, text: 'for Auto-Reacts' },
        { type: ActivityType.Competing, text: 'Beat Battles' }
    ],
    updateInterval: 300000
};

// Command collection
client.commands = new Collection();
client.prefixCommands = new Collection();

// =============== LOAD COMMANDS ===============
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        // Store slash commands
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded slash command: ${command.data.name}`);
        }
        
        // Store prefix commands
        if (command.prefixInfo && command.prefixInfo.name) {
            client.prefixCommands.set(command.prefixInfo.name, command);
            
            // Also store aliases
            if (command.prefixInfo.aliases) {
                for (const alias of command.prefixInfo.aliases) {
                    client.prefixCommands.set(alias, command);
                }
            }
            console.log(`✅ Loaded prefix command: ${command.prefixInfo.name}`);
        }
        
    } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
    }
}

// =============== BOT READY EVENT ===============
client.once('ready', async () => {
    console.log(`🔥 ${config.botName} Bot online as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    console.log(`📁 Loaded ${client.commands.size} slash commands`);
    console.log(`📁 Loaded ${client.prefixCommands.size} prefix commands`);
    
    // Initialize status rotation
    updateBotStatus();
    setInterval(updateBotStatus, global.botStatus.updateInterval);
    
    // =============== SLASH COMMAND REGISTRATION ===============
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('\n🔄 Starting slash command registration...');
        
        // =============== CLEAR OLD COMMANDS ===============
        // This removes ALL old commands before registering new ones
        console.log('🧹 Clearing old commands...');
        
        // Clear global commands
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );
        console.log('✅ Cleared global commands');
        
        // Clear guild commands (if GUILD_ID exists)
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: [] }
            );
            console.log(`✅ Cleared commands for guild: ${process.env.GUILD_ID}`);
        }
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // =============== REGISTER NEW COMMANDS ===============
        console.log(`📦 Registering ${commands.length} new commands...`);
        
        let data;
        
        // Register to specific guild (INSTANT - RECOMMENDED FOR TESTING)
        if (process.env.GUILD_ID) {
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(`✅ Registered ${data.length} commands to GUILD (INSTANT!)`);
            console.log('✨ Slash commands will appear INSTANTLY in your server!');
        }
        // Register globally (Takes 1 hour - NOT RECOMMENDED FOR TESTING)
        else if (process.env.DEPLOY_GLOBAL === 'true') {
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log(`✅ Registered ${data.length} commands GLOBALLY`);
            console.log('⏰ Global commands take up to 1 HOUR to appear');
        }
        else {
            console.log('⚠️ No deployment target set in .env!');
            console.log('💡 Set GUILD_ID for instant registration');
        }
        
        // Show registered commands
        if (data) {
            console.log('\n📋 REGISTERED SLASH COMMANDS:');
            data.forEach((cmd, index) => {
                console.log(`${index + 1}. /${cmd.name} - ${cmd.description || 'No description'}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Slash command registration FAILED:', error);
        
        // Helpful error messages
        if (error.code === 50001) {
            console.log('\n🔑 MISSING ACCESS: Bot needs "applications.commands" scope!');
            console.log('Invite bot with this link:');
            console.log(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot+applications.commands&permissions=8`);
        }
        else if (error.code === 10004) {
            console.log('\n❌ UNKNOWN GUILD: Check GUILD_ID in .env file!');
        }
        else if (error.code === 50013) {
            console.log('\n🚫 MISSING PERMISSIONS: Bot needs Administrator permission!');
        }
    }
    
    // Log auto-react status
    console.log('\n🤖 AUTO-REACT STATUS:');
    console.log(`✨ Intro: ${global.autoReactChannels.intro?.enabled ? '✅' : '❌'}`);
    console.log(`🎵 Music: ${global.autoReactChannels.music?.enabled ? '✅' : '❌'}`);
    console.log(`🎨 Art: ${global.autoReactChannels.art?.enabled ? '✅' : '❌'}`);
    
    console.log('\n🚀 Bot is ready!');
    console.log(`💡 Prefix: "${PREFIX}" | Slash commands: "/"`);
});

// =============== BOT STATUS ROTATION ===============
function updateBotStatus() {
    try {
        const status = global.botStatus.statuses[global.botStatus.currentIndex];
        client.user.setPresence({
            activities: [{
                name: status.text,
                type: status.type
            }],
            status: 'online'
        });
        
        global.botStatus.currentIndex = (global.botStatus.currentIndex + 1) % global.botStatus.statuses.length;
    } catch (error) {
        console.error('Status update error:', error);
    }
}

// =============== MESSAGE CREATE HANDLER ===============
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // =============== PREFIX COMMAND HANDLER ===============
    if (config.enablePrefix && message.content.startsWith(PREFIX) && !message.author.bot) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = client.prefixCommands.get(commandName);
        
        if (command && command.prefixExecute) {
            try {
                await command.prefixExecute(message, args);
            } catch (error) {
                console.error(`Prefix command error (${commandName}):`, error);
                message.reply('❌ Error executing command!');
            }
            return;
        }
    }
    
    // =============== AUTO-REACT HANDLERS ===============
    
    // INTRO CHANNEL
    if (global.autoReactChannels?.intro?.enabled && 
        message.channel.id === global.autoReactChannels.intro.channelId) {
        try {
            const reactions = global.autoReactChannels.intro.reactions || ['✨', '👋'];
            for (const emoji of reactions) {
                await message.react(emoji);
            }
            global.autoReactChannels.intro.count = (global.autoReactChannels.intro.count || 0) + 1;
        } catch (error) {
            console.error('Intro react error:', error);
        }
    }
    
    // MUSIC CHANNEL
    if (global.autoReactChannels?.music?.enabled && 
        message.channel.id === global.autoReactChannels.music.channelId &&
        message.attachments.size > 0) {
        
        const attachment = message.attachments.first();
        const config = global.autoReactChannels.music;
        
        const isAudioFile = config.allowedFormats?.some(format => 
            attachment.name.toLowerCase().endsWith(format)
        ) || true;
        
        if (!config.checkFormat || isAudioFile) {
            try {
                const reactions = config.reactions || ['🎵', '🎧', '🔥'];
                for (const emoji of reactions) {
                    await message.react(emoji);
                }
                config.count = (config.count || 0) + 1;
            } catch (error) {
                console.error('Music react error:', error);
            }
        }
    }
    
    // ART CHANNEL
    if (global.autoReactChannels?.art?.enabled && 
        message.channel.id === global.autoReactChannels.art.channelId &&
        message.attachments.size > 0) {
        
        const attachment = message.attachments.first();
        const config = global.autoReactChannels.art;
        
        const isImageFile = config.imageFormats?.some(format => 
            attachment.name.toLowerCase().endsWith(format)
        ) || true;
        
        if (!config.imagesOnly || isImageFile) {
            try {
                const reactions = config.reactions || ['🎨', '✨', '👌'];
                for (const emoji of reactions) {
                    await message.react(emoji);
                }
                config.count = (config.count || 0) + 1;
            } catch (error) {
                console.error('Art react error:', error);
            }
        }
    }
});

// =============== SLASH COMMAND HANDLER ===============
client.on(Events.InteractionCreate, async interaction => {
    // Slash commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            return interaction.reply({ 
                content: '❌ Command not found! It may have been removed.', 
                ephemeral: true 
            });
        }
        
        try {
            await command.execute(interaction);
            console.log(`✅ Slash command used: /${interaction.commandName} by ${interaction.user.tag}`);
        } catch (error) {
            console.error(`Slash command error (/${interaction.commandName}):`, error);
            
            const errorMsg = '❌ An error occurred while executing this command.';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMsg, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    }
    
    // Buttons
    else if (interaction.isButton()) {
        // Handle button interactions if needed
        await interaction.reply({ content: '⚠️ Button not configured', ephemeral: true });
    }
});

// =============== ERROR HANDLING ===============
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

// =============== START BOT ===============
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log(`🚀 ${config.botName} Bot starting...`);
    })
    .catch(error => {
        console.error('❌ Failed to login:', error);
        console.log('\n🔧 Check your .env file:');
        console.log('1. DISCORD_TOKEN is correct');
        console.log('2. CLIENT_ID is correct');
        console.log('3. Bot is invited to server');
        process.exit(1);
    });

// Export for testing
module.exports = { client, config };