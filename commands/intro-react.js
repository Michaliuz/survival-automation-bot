const { SlashCommandBuilder } = require('discord.js');
const { prefix } = require('../config.json') || { prefix: '!' };

module.exports = {
    // =============== SLASH COMMAND ===============
    data: new SlashCommandBuilder()
        .setName('intro-react')
        .setDescription('Set channel for auto-reacting to introductions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set introduction channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Select introduction channel')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reaction')
                        .setDescription('Choose reaction emoji(s)')
                        .setRequired(false)
                        .addChoices(
                            { name: '✨ 👋', value: '✨ 👋' },
                            { name: '🎉 🎊', value: '🎉 🎊' },
                            { name: '👋 🤝', value: '👋 🤝' },
                            { name: '✨ 🔥', value: '✨ 🔥' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove auto-react from introduction channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check current intro-react settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test auto-react in current channel')),
    
    // =============== PREFIX COMMAND INFO ===============
    prefixInfo: {
        name: 'introreact',
        aliases: ['setintro', 'introchannel'],
        usage: `${prefix}introreact set <#channel> [emojis]\n${prefix}introreact remove\n${prefix}introreact status\n${prefix}introreact test`,
        description: 'Set auto-react for introduction channel',
        examples: [
            `${prefix}introreact set #introductions`,
            `${prefix}introreact set #welcome ✨ 👋`,
            `${prefix}introreact status`,
            `${prefix}introreact test`
        ]
    },
    
    // =============== SLASH COMMAND EXECUTE ===============
    async execute(interaction) {
        await handleIntroReact(interaction, true);
    },
    
    // =============== PREFIX COMMAND EXECUTE ===============
    async prefixExecute(message, args) {
        await handleIntroReact(message, false, args);
    }
};

// =============== MAIN HANDLER ===============
async function handleIntroReact(context, isSlash, args = []) {
    const isAdmin = isSlash 
        ? context.member.permissions.has('ADMINISTRATOR')
        : context.member.permissions.has('ADMINISTRATOR');
    
    if (!isAdmin) {
        const reply = { content: '❌ Only administrators can manage auto-react!' };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
    
    const subcommand = isSlash 
        ? context.options.getSubcommand()
        : (args[0] || 'status');
    
    // =============== SET CHANNEL ===============
    if (subcommand === 'set') {
        let channel, reactionEmojis = '✨ 👋';
        
        if (isSlash) {
            channel = context.options.getChannel('channel');
            const reactionChoice = context.options.getString('reaction');
            if (reactionChoice) reactionEmojis = reactionChoice;
        } else {
            // Parse prefix command: !introreact set #channel ✨ 👋
            const channelMention = args[1];
            if (!channelMention) {
                return context.reply(`❌ Usage: ${prefix}introreact set <#channel> [emojis]`);
            }
            
            // Extract channel ID from mention
            const channelId = channelMention.replace(/[<#>]/g, '');
            channel = context.guild.channels.cache.get(channelId);
            
            if (!channel) {
                return context.reply('❌ Please mention a valid channel!');
            }
            
            // Get emojis from args
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
        global.autoReactChannels.intro = {
            channelId: channel.id,
            reactions: reactionEmojis.split(' ').filter(e => e),
            enabled: true,
            setBy: isSlash ? context.user.id : context.author.id,
            setAt: Date.now()
        };
        
        const response = {
            content: `✅ **Intro Auto-React Enabled!**\n\n**Channel:** ${channel}\n**Reactions:** ${reactionEmojis}\n**Status:** ✅ Active\n\n**Bot will now:**\n1. Auto-react to new messages\n2. Send welcome DMs\n3. Track introductions`,
            embeds: isSlash ? [] : undefined
        };
        
        console.log(`✅ Intro channel set to: ${channel.name} (${channel.id})`);
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== REMOVE CHANNEL ===============
    else if (subcommand === 'remove') {
        if (!global.autoReactChannels?.intro) {
            const reply = { content: '❌ No intro channel is currently set!' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        const oldChannel = context.guild.channels.cache.get(global.autoReactChannels.intro.channelId);
        delete global.autoReactChannels.intro;
        
        const response = {
            content: `✅ **Intro Auto-React Disabled!**\n\nRemoved from: ${oldChannel || 'Previous channel'}\n\nBot will no longer auto-react to introductions.`
        };
        
        console.log('❌ Intro auto-react disabled');
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== CHECK STATUS ===============
    else if (subcommand === 'status') {
        const introConfig = global.autoReactChannels?.intro;
        
        if (!introConfig) {
            const response = {
                content: '📭 **Intro Auto-React Status:**\n\n❌ Not configured\n\nUse `/intro-react set` to enable'
            };
            
            return isSlash 
                ? context.reply({ ...response, ephemeral: true })
                : context.reply(response);
        }
        
        const channel = context.guild.channels.cache.get(introConfig.channelId);
        const setBy = await context.client.users.fetch(introConfig.setBy).catch(() => ({ tag: 'Unknown' }));
        const setTime = `<t:${Math.floor(introConfig.setAt/1000)}:R>`;
        
        const response = {
            content: `📊 **Intro Auto-React Status**\n\n**Channel:** ${channel || 'Not found'}\n**Status:** ${introConfig.enabled ? '✅ Active' : '❌ Disabled'}\n**Reactions:** ${introConfig.reactions.join(' ')}\n**Set By:** ${setBy.tag}\n**Set:** ${setTime}\n**Messages Reacted:** ${introConfig.count || 0}`,
            embeds: isSlash ? [] : undefined
        };
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== TEST REACT ===============
    else if (subcommand === 'test') {
        const introConfig = global.autoReactChannels?.intro;
        
        if (!introConfig) {
            const reply = { content: '❌ No intro channel configured! Set one first.' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        // Test by reacting to current message
        try {
            const emojis = introConfig.reactions;
            
            // Add reactions
            for (const emoji of emojis) {
                await context.react(emoji);
            }
            
            const response = {
                content: `✅ **Test Successful!**\n\nAdded reactions: ${emojis.join(' ')}\n\nIf this was an intro channel, the bot would also send a welcome DM.`
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
        const helpMessage = `**Intro-React Commands:**\n\n` +
            `**Set Channel:**\n\`/intro-react set <channel> [emojis]\`\n\`${prefix}introreact set <#channel> ✨ 👋\`\n\n` +
            `**Remove:**\n\`/intro-react remove\`\n\`${prefix}introreact remove\`\n\n` +
            `**Status:**\n\`/intro-react status\`\n\`${prefix}introreact status\`\n\n` +
            `**Test:**\n\`/intro-react test\`\n\`${prefix}introreact test\``;
        
        const reply = { content: helpMessage };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
}