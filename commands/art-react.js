const { SlashCommandBuilder } = require('discord.js');
const { prefix } = require('../config.json') || { prefix: '!' };

module.exports = {
    // =============== SLASH COMMAND ===============
    data: new SlashCommandBuilder()
        .setName('art-react')
        .setDescription('Auto-react to artwork/images in channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set artwork channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Select artwork channel')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reactions')
                        .setDescription('Reaction emojis (space separated)')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('images-only')
                        .setDescription('React only to image files')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove auto-react from art channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check art-react settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test art reactions')),
    
    // =============== PREFIX COMMAND INFO ===============
    prefixInfo: {
        name: 'artreact',
        aliases: ['setart', 'artchannel'],
        usage: `${prefix}artreact set <#channel> [emojis]\n${prefix}artreact remove\n${prefix}artreact status\n${prefix}artreact test`,
        description: 'Auto-react to artwork and images',
        examples: [
            `${prefix}artreact set #artwork`,
            `${prefix}artreact set #designs 🎨 ✨ 🔥`,
            `${prefix}artreact status`,
            `${prefix}artreact test`
        ]
    },
    
    // =============== SLASH COMMAND EXECUTE ===============
    async execute(interaction) {
        await handleArtReact(interaction, true);
    },
    
    // =============== PREFIX COMMAND EXECUTE ===============
    async prefixExecute(message, args) {
        await handleArtReact(message, false, args);
    }
};

async function handleArtReact(context, isSlash, args = []) {
    const isAdmin = isSlash 
        ? context.member.permissions.has('ADMINISTRATOR')
        : context.member.permissions.has('ADMINISTRATOR');
    
    if (!isAdmin) {
        const reply = { content: '❌ Only administrators can manage art auto-react!' };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
    
    const subcommand = isSlash 
        ? context.options.getSubcommand()
        : (args[0] || 'status');
    
    // =============== SET CHANNEL ===============
    if (subcommand === 'set') {
        let channel, reactionEmojis = '🎨 ✨ 👌', imagesOnly = true;
        
        if (isSlash) {
            channel = context.options.getChannel('channel');
            const reactions = context.options.getString('reactions');
            if (reactions) reactionEmojis = reactions;
            imagesOnly = context.options.getBoolean('images-only') ?? true;
        } else {
            const channelMention = args[1];
            if (!channelMention) {
                return context.reply(`❌ Usage: ${prefix}artreact set <#channel> [emojis]`);
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
        global.autoReactChannels.art = {
            channelId: channel.id,
            reactions: reactionEmojis.split(' ').filter(e => e),
            imagesOnly: imagesOnly,
            imageFormats: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            enabled: true,
            setBy: isSlash ? context.user.id : context.author.id,
            setAt: Date.now(),
            count: 0
        };
        
        const response = {
            content: `✅ **Art Auto-React Enabled!**\n\n**Channel:** ${channel}\n**Reactions:** ${reactionEmojis}\n**Images Only:** ${imagesOnly ? '✅' : '❌'}\n\n**Bot will auto-react to:**\n• PNG, JPG, GIF, WEBP images\n• With reactions: ${reactionEmojis}`,
            embeds: isSlash ? [] : undefined
        };
        
        console.log(`✅ Art channel set to: ${channel.name} (${channel.id})`);
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== REMOVE CHANNEL ===============
    else if (subcommand === 'remove') {
        if (!global.autoReactChannels?.art) {
            const reply = { content: '❌ No art channel is currently set!' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        const oldChannel = context.guild.channels.cache.get(global.autoReactChannels.art.channelId);
        delete global.autoReactChannels.art;
        
        const response = {
            content: `✅ **Art Auto-React Disabled!**\n\nRemoved from: ${oldChannel || 'Previous channel'}`
        };
        
        console.log('❌ Art auto-react disabled');
        
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // =============== CHECK STATUS ===============
    else if (subcommand === 'status') {
        const artConfig = global.autoReactChannels?.art;
        
        if (!artConfig) {
            const response = {
                content: '📭 **Art Auto-React Status:**\n\n❌ Not configured\n\nUse `/art-react set` to enable'
            };
            
            return isSlash 
                ? context.reply({ ...response, ephemeral: true })
                : context.reply(response);
        }
        
        const channel = context.guild.channels.cache.get(artConfig.channelId);
        const setBy = await context.client.users.fetch(artConfig.setBy).catch(() => ({ tag: 'Unknown' }));
        const setTime = `<t:${Math.floor(artConfig.setAt/1000)}:R>`;
        
        const statusMessage = `📊 **Art Auto-React Status**\n\n` +
            `**Channel:** ${channel || 'Not found'}\n` +
            `**Status:** ${artConfig.enabled ? '✅ Active' : '❌ Disabled'}\n` +
            `**Reactions:** ${artConfig.reactions.join(' ')}\n` +
            `**Images Only:** ${artConfig.imagesOnly ? '✅' : '❌'}\n` +
            `**Allowed Formats:** ${artConfig.imageFormats.join(', ')}\n` +
            `**Set By:** ${setBy.tag}\n` +
            `**Set:** ${setTime}\n` +
            `**Artworks Reacted:** ${artConfig.count || 0}`;
        
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
        const artConfig = global.autoReactChannels?.art;
        
        if (!artConfig) {
            const reply = { content: '❌ No art channel configured! Set one first.' };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        try {
            const emojis = artConfig.reactions;
            
            // Add reactions to test
            for (const emoji of emojis) {
                await context.react(emoji);
            }
            
            const response = {
                content: `✅ **Art React Test!**\n\nAdded reactions: ${emojis.join(' ')}\n\nIf this was an image, the bot would auto-react with these emojis.`
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
        const helpMessage = `**Art-React Commands:**\n\n` +
            `**Set Channel:**\n\`/art-react set <channel> [emojis]\`\n\`${prefix}artreact set <#channel> 🎨 ✨ 👌\`\n\n` +
            `**Remove:**\n\`/art-react remove\`\n\`${prefix}artreact remove\`\n\n` +
            `**Status:**\n\`/art-react status\`\n\`${prefix}artreact status\`\n\n` +
            `**Test:**\n\`/art-react test\`\n\`${prefix}artreact test\``;
        
        const reply = { content: helpMessage };
        return isSlash 
            ? context.reply({ ...reply, ephemeral: true })
            : context.reply(reply);
    }
}