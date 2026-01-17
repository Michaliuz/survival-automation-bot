const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-status')
        .setDescription('Update bot status/activity')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add new status to rotation')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Activity type')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Playing', value: 'Playing' },
                            { name: 'Listening', value: 'Listening' },
                            { name: 'Watching', value: 'Watching' },
                            { name: 'Competing', value: 'Competing' }
                        ))
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('Status text (max 128 chars)')
                        .setRequired(true)
                        .setMaxLength(128)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all current statuses'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a status from rotation')
                .addIntegerOption(option =>
                    option.setName('index')
                        .setDescription('Status number to remove (check /bot-status list)')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('interval')
                .setDescription('Change status update interval')
                .addIntegerOption(option =>
                    option.setName('minutes')
                        .setDescription('Minutes between status changes (1-60)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(60))),
    
    async execute(interaction) {
        // Check if user is bot owner/admin
        if (interaction.user.id !== process.env.OWNER_ID && !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ 
                content: '❌ Only bot owner or administrators can update bot status!', 
                ephemeral: true 
            });
        }
        
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'add') {
            const type = interaction.options.getString('type');
            const text = interaction.options.getString('text');
            
            // Map string to ActivityType
            const activityMap = {
                'Playing': ActivityType.Playing,
                'Listening': ActivityType.Listening,
                'Watching': ActivityType.Watching,
                'Competing': ActivityType.Competing
            };
            
            global.botStatus.statuses.push({
                type: activityMap[type],
                text: text
            });
            
            await interaction.reply({ 
                content: `✅ Added new status: **${type} ${text}**\nTotal statuses: ${global.botStatus.statuses.length}`,
                ephemeral: true 
            });
            
        } else if (subcommand === 'list') {
            if (global.botStatus.statuses.length === 0) {
                return interaction.reply({ 
                    content: '📭 No statuses configured yet! Use `/bot-status add` to add some.',
                    ephemeral: true 
                });
            }
            
            const statusList = global.botStatus.statuses.map((status, index) => {
                const typeName = Object.keys(ActivityType).find(key => ActivityType[key] === status.type);
                return `${index + 1}. **${typeName}** ${status.text}`;
            }).join('\n');
            
            const intervalMinutes = Math.floor(global.botStatus.updateInterval / 60000);
            
            const embed = {
                title: '🤖 Bot Status Rotation',
                description: statusList,
                color: 0x00FF00,
                fields: [
                    {
                        name: 'Current Interval',
                        value: `${intervalMinutes} minutes`,
                        inline: true
                    },
                    {
                        name: 'Total Statuses',
                        value: `${global.botStatus.statuses.length}`,
                        inline: true
                    },
                    {
                        name: 'Next Update',
                        value: `<t:${Math.floor((Date.now() + global.botStatus.updateInterval) / 1000)}:R>`,
                        inline: true
                    }
                ],
                footer: {
                    text: 'Use /bot-status remove <number> to delete'
                },
                timestamp: new Date()
            };
            
            await interaction.reply({ 
                embeds: [embed],
                ephemeral: true 
            });
            
        } else if (subcommand === 'remove') {
            const index = interaction.options.getInteger('index') - 1;
            
            if (index < 0 || index >= global.botStatus.statuses.length) {
                return interaction.reply({ 
                    content: `❌ Invalid index! Please use a number between 1 and ${global.botStatus.statuses.length}`,
                    ephemeral: true 
                });
            }
            
            const removed = global.botStatus.statuses.splice(index, 1)[0];
            const typeName = Object.keys(ActivityType).find(key => ActivityType[key] === removed.type);
            
            // Reset current index if needed
            if (global.botStatus.currentIndex >= global.botStatus.statuses.length) {
                global.botStatus.currentIndex = 0;
            }
            
            await interaction.reply({ 
                content: `✅ Removed status: **${typeName} ${removed.text}**\nRemaining: ${global.botStatus.statuses.length}`,
                ephemeral: true 
            });
            
        } else if (subcommand === 'interval') {
            const minutes = interaction.options.getInteger('minutes');
            global.botStatus.updateInterval = minutes * 60000;
            
            await interaction.reply({ 
                content: `✅ Status update interval changed to **${minutes} minutes**`,
                ephemeral: true 
            });
        }
    }
};