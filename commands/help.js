const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { prefix } = require('../config.json') || { prefix: '!' };
const fs = require('fs');
const path = require('path');

module.exports = {
    // =============== SLASH COMMAND ===============
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all bot commands')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Get help for specific command')
                .setRequired(false)),
    
    // =============== PREFIX COMMAND INFO ===============
    prefixInfo: {
        name: 'help',
        aliases: ['commands', 'h', 'cmd'],
        usage: `${prefix}help [command]`,
        description: 'Show all bot commands',
        examples: [
            `${prefix}help`,
            `${prefix}help introreact`,
            `${prefix}help bot-status`
        ]
    },
    
    // =============== SLASH COMMAND EXECUTE ===============
    async execute(interaction) {
        await handleHelp(interaction, true);
    },
    
    // =============== PREFIX COMMAND EXECUTE ===============
    async prefixExecute(message, args) {
        await handleHelp(message, false, args);
    }
};

async function handleHelp(context, isSlash, args = []) {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    // Get specific command if requested
    const requestedCommand = isSlash 
        ? context.options.getString('command') 
        : args[0];
    
    if (requestedCommand) {
        // Find specific command
        const commandFile = commandFiles.find(file => {
            try {
                const cmd = require(path.join(commandsPath, file));
                const cmdName = cmd.prefixInfo?.name?.toLowerCase();
                const cmdAliases = cmd.prefixInfo?.aliases?.map(a => a.toLowerCase()) || [];
                const slashName = cmd.data?.name?.toLowerCase();
                
                return requestedCommand.toLowerCase() === cmdName ||
                       requestedCommand.toLowerCase() === slashName ||
                       cmdAliases.includes(requestedCommand.toLowerCase());
            } catch (error) {
                return false;
            }
        });
        
        if (!commandFile) {
            const reply = { content: `❌ Command \`${requestedCommand}\` not found!` };
            return isSlash 
                ? context.reply({ ...reply, ephemeral: true })
                : context.reply(reply);
        }
        
        const command = require(path.join(commandsPath, commandFile));
        const prefixInfo = command.prefixInfo || {};
        const slashInfo = command.data || {};
        
        // Create detailed help embed
        const embed = new EmbedBuilder()
            .setTitle(`📘 Command: ${prefixInfo.name || slashInfo.name || commandFile.replace('.js', '')}`)
            .setColor(0x5865F2)
            .setFooter({ text: 'Survival Automation Bot' })
            .setTimestamp();
        
        // Add description
        if (prefixInfo.description || slashInfo.description) {
            embed.setDescription(prefixInfo.description || slashInfo.description);
        }
        
        // Add usage
        const fields = [];
        
        if (prefixInfo.usage) {
            fields.push({
                name: '📝 Prefix Usage',
                value: `\`\`\`${prefixInfo.usage}\`\`\``,
                inline: false
            });
        }
        
        if (slashInfo.name) {
            let slashUsage = `/${slashInfo.name}`;
            if (slashInfo.options && slashInfo.options.length > 0) {
                slashUsage += ' [options]';
            }
            fields.push({
                name: '🔗 Slash Command',
                value: `\`\`\`${slashUsage}\`\`\``,
                inline: false
            });
        }
        
        // Add examples
        if (prefixInfo.examples && prefixInfo.examples.length > 0) {
            fields.push({
                name: '💡 Examples',
                value: prefixInfo.examples.map(ex => `• ${ex}`).join('\n'),
                inline: false
            });
        }
        
        // Add aliases
        if (prefixInfo.aliases && prefixInfo.aliases.length > 0) {
            fields.push({
                name: '🔄 Aliases',
                value: prefixInfo.aliases.map(a => `\`${a}\``).join(', '),
                inline: true
            });
        }
        
        embed.addFields(fields);
        
        const response = { embeds: [embed] };
        return isSlash 
            ? context.reply({ ...response, ephemeral: true })
            : context.reply(response);
    }
    
    // Show all commands
    const categories = {
        '🤖 Auto-React Commands': ['intro-react.js', 'music-react.js', 'art-react.js'],
        '⚙️ Bot Management': ['autobotstatusupdate.js'],
        '❓ General': ['help.js']
    };
    
    const embed = new EmbedBuilder()
        .setTitle('🤖 Survival Automation Bot - Commands')
        .setDescription(`**Prefix:** \`${prefix}\`\n**Slash Commands:** \`/\`\n\nUse \`${prefix}help <command>\` or \`/help <command>\` for detailed info`)
        .setColor(0x00FF00)
        .setFooter({ text: `Total Commands: ${commandFiles.length} | Bot Version: 1.0.0` })
        .setTimestamp();
    
    // Add command categories
    for (const [category, files] of Object.entries(categories)) {
        const commandsList = [];
        
        for (const file of files) {
            if (fs.existsSync(path.join(commandsPath, file))) {
                try {
                    const cmd = require(path.join(commandsPath, file));
                    const name = cmd.prefixInfo?.name || cmd.data?.name || file.replace('.js', '');
                    const desc = cmd.prefixInfo?.description || cmd.data?.description || 'No description';
                    
                    commandsList.push(`• **${name}** - ${desc}`);
                } catch (error) {
                    console.error(`Error loading ${file}:`, error);
                }
            }
        }
        
        if (commandsList.length > 0) {
            embed.addFields({
                name: category,
                value: commandsList.join('\n'),
                inline: false
            });
        }
    }
    
    // Add other commands not in categories
    const otherCommands = [];
    for (const file of commandFiles) {
        const isCategorized = Object.values(categories).flat().includes(file);
        if (!isCategorized && fs.existsSync(path.join(commandsPath, file))) {
            try {
                const cmd = require(path.join(commandsPath, file));
                const name = cmd.prefixInfo?.name || cmd.data?.name || file.replace('.js', '');
                otherCommands.push(`• **${name}**`);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    }
    
    if (otherCommands.length > 0) {
        embed.addFields({
            name: '📁 Other Commands',
            value: otherCommands.join('\n'),
            inline: false
        });
    }
    
    // Add useful links
    embed.addFields({
        name: '🔗 Quick Links',
        value: `[Invite Bot](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot+applications.commands&permissions=8) | [Support Server](https://discord.gg/your-server) | [GitHub](https://github.com/your-repo)`,
        inline: false
    });
    
    const response = { embeds: [embed] };
    return isSlash 
        ? context.reply({ ...response, ephemeral: true })
        : context.reply(response);
}