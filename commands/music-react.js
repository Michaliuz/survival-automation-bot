const { SlashCommandBuilder } = require('discord.js');
const { prefix } = require('../config.json') || { prefix: '!' };

module.exports = {
    // =============== SLASH COMMAND ===============
    data: new SlashCommandBuilder()
        .setName('music-react')
        .setDescription('Auto-react to music submissions in channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set music submission channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Select music submission channel')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reactions')
                        .setDescription('Reaction emojis (space separated)')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('check-format')
                        .setDescription('Check if files are audio formats')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove auto-react from music channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check music-react settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test music reactions')),
    
    // =============== PREFIX COMMAND INFO ===============
    prefixInfo: {
        name: 'musicreact',
        aliases: ['setmusic', 'musicchannel'],
        usage: `${prefix}musicreact set <#channel> [emojis]\n${prefix}musicreact remove\n${prefix}musicreact status\n${prefix}musicreact test`,
        description: 'Auto-react to music submissions',
        examples: [
            `${prefix}musicreact set #music-submissions`,
            `${prefix}musicreact set #tracks 🎵 🎧 🔊`,
            `${prefix}musicreact status`,
            `${prefix}musicreact test`
        ]
    },
    
    // =============== SLASH COMMAND EXECUTE ===============
    async execute(interaction) {
        await handleMusicReact(interaction, true);
    },
    
    // =============== PREFIX COMMAND EXECUTE ===============
    async prefixExecute(message, args) {
        await handleMusicReact(message, false, args);
    }
};

async function handleMusicReact(context, isSlash, args = []) {
    const isAdmin = isSlash 
        ? context.member.permissions.has('ADMINISTRATOR')
        : context.member.permissions.has('ADMINISTRATOR');
    
    if (!isAdmin) {
        const reply = { content: '❌ Only administrators can manage music auto-react!' };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
    
    const subcommand = isSlash 
        ? context.options.getSubcommand()
        : (args[0] || 'status');
    
    // =============== SET CHANNEL ===============
    if (subcommand === 'set') {
        let channel, reactionEmojis = '🎵 🎧 🔊', checkFormat = true;
        
        if (isSlash) {
            channel = context.options.getChannel('channel');
            const reactions = context.options.getString('reactions');
            if (reactions) reactionEmojis = reactions;
            checkFormat = context.options.getBoolean('check-format') ?? true;
        } else {
            const channelMention = args[1];
            if (!channelMention) {
                return context.reply(`❌ Usage: ${prefix}musicreact set <#channel> [emojis]`);
            }
            
            const channelId = channelMention.replace(/[<#>]/g, '');
            channel = context.guild.channels.cache.get(channelId);
            
            if (!channel) {
                return context.reply('❌ Please mention a valid channel!');
            }
            
            if (args.length > 2) {
                reactionEmojis = args.slice(2).join(' ');
            }
        }
        
        if (channel.type !== 0) {
            const reply = { content: '❌ Please select a text channel!' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        // Save settings
        if (!global.autoReactChannels) global.autoReactChannels = {};
        global.autoReactChannels.music = {
            channelId: channel.id,
            reactions: reactionEmojis.split(' ').filter(e => e),
            checkFormat: checkFormat,
            allowedFormats: ['.mp3', '.wav', '.flac', '.m4a', '.aac'],
            enabled: true,
            setBy: isSlash ? context.user.id : context.author.id,
            setAt: Date.now(),
            count: 0
        };
        
        const response = {
            content: `✅ **Music Auto-React Enabled!**\n\n**Channel:** ${channel}\n**Reactions:** ${reactionEmojis}\n**Format Check:** ${checkFormat ? '✅' : '❌'}\n\n**Bot will auto-react to:**\n• MP3, WAV, FLAC, M4A, AAC files\n• With reactions: ${reactionEmojis}`,
            embeds: isSlash ? [] : undefined
        };
        
        console.log(`✅ Music channel set to: ${channel.name} (${channel.id})`);
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== REMOVE CHANNEL ===============
    else if (subcommand === 'remove') {
        if (!global.autoReactChannels?.music) {
            const reply = { content: '❌ No music channel is currently set!' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        const oldChannel = context.guild.channels.cache.get(global.autoReactChannels.music.channelId);
        delete global.autoReactChannels.music;
        
        const response = {
            content: `✅ **Music Auto-React Disabled!**\n\nRemoved from: ${oldChannel || 'Previous channel'}`
        };
        
        console.log('❌ Music auto-react disabled');
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== CHECK STATUS ===============
    else if (subcommand === 'status') {
        const musicConfig = global.autoReactChannels?.music;
        
        if (!musicConfig) {
            const response = {
                content: '📭 **Music Auto-React Status:**\n\n❌ Not configured\n\nUse `/music-react set` to enable'
            };
            
            return isSlash 
                ? context.reply({ ...response, ephemeral: true })
                : context.reply(response);
        }
        
        const channel = context.guild.channels.cache.get(musicConfig.channelId);
        const setBy = await context.client.users.fetch(musicConfig.setBy).catch(() => ({ tag: 'Unknown' }));
        const setTime = `<t:${Math.floor(musicConfig.setAt/1000)}:R>`;
        
        const statusMessage = `📊 **Music Auto-React Status**\n\n` +
            `**Channel:** ${channel || 'Not found'}\n` +
            `**Status:** ${musicConfig.enabled ? '✅ Active' : '❌ Disabled'}\n` +
            `**Reactions:** ${musicConfig.reactions.join(' ')}\n` +
            `**Format Check:** ${musicConfig.checkFormat ? '✅' : '❌'}\n` +
            `**Allowed Formats:** ${musicConfig.allowedFormats.join(', ')}\n` +
            `**Set By:** ${setBy.tag}\n` +
            `**Set:** ${setTime}\n` +
            `**Tracks Reacted:** ${musicConfig.count || 0}`;
        
        const response = {
            content: statusMessage,
            embeds: isSlash ? [] : undefined
        };
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== TEST REACT ===============
    else if (subcommand === 'test') {
        const musicConfig = global.autoReactChannels?.music;
        
        if (!musicConfig) {
            const reply = { content: '❌ No music channel configured! Set one first.' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        try {
            const emojis = musicConfig.reactions;
            
            // Add reactions to test
            for (const emoji of emojis) {
                await context.react(emoji);
            }
            
            const response = {
                content: `✅ **Music React Test!**\n\nAdded reactions: ${emojis.join(' ')}\n\nIf this was a music file, the bot would auto-react with these emojis.`
            };
            
            return isSlash 
                ? context.reply({ ...response, ephemeral: true })
                : context.reply(response);
                
        } catch (error) {
            console.error('Test react error:', error);
            const reply = { content: `❌ Test failed: ${error.message}` };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
    }
    
    // =============== INVALID SUBCOMMAND ===============
    else {
        const helpMessage = `**Music-React Commands:**\n\n` +
            `**Set Channel:**\n\`/music-react set <channel> [emojis]\`\n\`${prefix}musicreact set <#channel> 🎵 🎧 🔊\`\n\n` +
            `**Remove:**\n\`/music-react remove\`\n\`${prefix}musicreact remove\`\n\n` +
            `**Status:**\n\`/music-react status\`\n\`${prefix}musicreact status\`\n\n` +
            `**Test:**\n\`/music-react test\`\n\`${prefix}musicreact test\``;
        
        const reply = { content: helpMessage };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
}