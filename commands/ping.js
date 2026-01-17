const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { prefix } = require('../config.json') || { prefix: '!' };

module.exports = {
    // =============== SLASH COMMAND ===============
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and status'),
    
    // =============== PREFIX COMMAND INFO ===============
    prefixInfo: {
        name: 'ping',
        aliases: ['pong', 'latency', 'status'],
        usage: `${prefix}ping`,
        description: 'Check bot latency and status',
        examples: [
            `${prefix}ping`,
            `${prefix}pong`
        ]
    },
    
    // =============== SLASH COMMAND EXECUTE ===============
    async execute(interaction) {
        await handlePing(interaction, true);
    },
    
    // =============== PREFIX COMMAND EXECUTE ===============
    async prefixExecute(message, args) {
        await handlePing(message, false, args);
    }
};

async function handlePing(context, isSlash, args = []) {
    try {
        // Start timing
        const startTime = Date.now();
        
        // Send initial response
        let initialResponse;
        if (isSlash) {
            // CORRECTED: Use context (which is interaction) not undefined variable
            await context.deferReply();
            initialResponse = await context.fetchReply();
        } else {
            initialResponse = await context.channel.send('🏓 Pinging...');
        }
        
        // Calculate latency
        const endTime = Date.now();
        const botLatency = endTime - startTime;
        const apiLatency = Math.round(context.client.ws.ping);
        
        // Get uptime
        const uptime = context.client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;
        
        // Get memory usage
        const memoryUsage = process.memoryUsage();
        const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
        
        // Get server stats
        const guildCount = context.client.guilds.cache.size;
        const channelCount = context.client.channels.cache.size;
        const userCount = context.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong! • Bot Status')
            .setColor(getPingColor(botLatency))
            .setThumbnail(context.client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: '📶 Latency',
                    value: `**Bot:** ${botLatency}ms\n**API:** ${apiLatency}ms`,
                    inline: true
                },
                {
                    name: '⏱️ Uptime',
                    value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },
                {
                    name: '💾 Memory',
                    value: `${usedMB}MB / ${totalMB}MB`,
                    inline: true
                },
                {
                    name: '📊 Server Stats',
                    value: `**Servers:** ${guildCount}\n**Channels:** ${channelCount}\n**Users:** ${userCount}`,
                    inline: false
                },
                {
                    name: '🔧 Auto-React Status',
                    value: getAutoReactStatus(),
                    inline: false
                }
            )
            .setFooter({ 
                text: `Requested by ${isSlash ? context.user.tag : context.author.tag}`,
                iconURL: isSlash ? context.user.displayAvatarURL() : context.author.displayAvatarURL()
            })
            .setTimestamp();
        
        // Add status indicator
        const statusIndicator = getStatusIndicator(botLatency, apiLatency);
        embed.setDescription(`${statusIndicator} **${context.client.user.username}** is online and responding!\n\n**Prefix:** \`${prefix}\`\n**Commands:** \`/\``);
        
        // Send response (FIXED for deprecated ephemeral warning)
        const response = { embeds: [embed], flags: isSlash ? 64 : undefined }; // 64 = EPHEMERAL
        
        if (isSlash) {
            // CORRECTED: Use context instead of interaction
            await context.editReply(response);
        } else {
            await initialResponse.edit(response);
        }
        
        // Log ping
        console.log(`📊 Ping command used by ${isSlash ? context.user.tag : context.author.tag} - Bot: ${botLatency}ms, API: ${apiLatency}ms`);
        
    } catch (error) {
        console.error('Ping command error:', error);
        
        const errorMessage = '❌ Error checking bot status!';
        if (isSlash) {
            // CORRECTED: Use context instead of interaction
            if (context.deferred || context.replied) {
                await context.editReply({ content: errorMessage, flags: 64 });
            } else {
                await context.reply({ content: errorMessage, flags: 64 }); // flags: 64 for ephemeral
            }
        } else {
            await context.reply(errorMessage);
        }
    }
}

// Helper function to get color based on latency
function getPingColor(latency) {
    if (latency < 100) return 0x00FF00; // Green - Excellent
    if (latency < 250) return 0xFFFF00; // Yellow - Good
    if (latency < 500) return 0xFFA500; // Orange - Okay
    return 0xFF0000; // Red - Poor
}

// Helper function to get status indicator
function getStatusIndicator(botLatency, apiLatency) {
    if (botLatency < 100 && apiLatency < 100) return '⚡'; // Lightning - Excellent
    if (botLatency < 200 && apiLatency < 200) return '✅'; // Check - Good
    if (botLatency < 400 && apiLatency < 400) return '⚠️'; // Warning - Okay
    return '❌'; // Cross - Poor
}

// Helper function to get auto-react status
function getAutoReactStatus() {
    if (!global.autoReactChannels) return '❌ Not configured';
    
    const statuses = [];
    
    if (global.autoReactChannels.intro?.enabled) {
        const channelName = global.autoReactChannels.intro.channelId ? `<#${global.autoReactChannels.intro.channelId}>` : 'Unknown';
        statuses.push(`✨ Intro: ${global.autoReactChannels.intro.count || 0} reacted`);
    }
    
    if (global.autoReactChannels.music?.enabled) {
        const channelName = global.autoReactChannels.music.channelId ? `<#${global.autoReactChannels.music.channelId}>` : 'Unknown';
        statuses.push(`🎵 Music: ${global.autoReactChannels.music.count || 0} reacted`);
    }
    
    if (global.autoReactChannels.art?.enabled) {
        const channelName = global.autoReactChannels.art.channelId ? `<#${global.autoReactChannels.art.channelId}>` : 'Unknown';
        statuses.push(`🎨 Art: ${global.autoReactChannels.art.count || 0} reacted`);
    }
    
    if (statuses.length === 0) {
        statuses.push('No auto-react channels configured');
    }
    
    return statuses.join('\n');
}

// Export helper functions for testing
module.exports.getPingColor = getPingColor;
module.exports.getStatusIndicator = getStatusIndicator;
module.exports.getAutoReactStatus = getAutoReactStatus;