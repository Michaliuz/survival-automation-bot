const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all command files
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️  Skipping ${file} - missing data or execute property`);
        }
    } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

        let data;
        
        // Deploy globally or to specific guild
        if (process.env.DEPLOY_GLOBAL === 'true') {
            console.log('🌍 Deploying commands globally (takes up to 1 hour)');
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log(`✅ Successfully reloaded ${data.length} global commands.`);
        } else if (process.env.GUILD_ID) {
            console.log(`🏠 Deploying commands to guild: ${process.env.GUILD_ID}`);
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(`✅ Successfully reloaded ${data.length} guild commands.`);
        } else {
            console.log('⚠️  No deployment target specified. Set DEPLOY_GLOBAL=true or GUILD_ID in .env');
            console.log('Available commands loaded:');
            commands.forEach(cmd => console.log(`  /${cmd.name}`));
            return;
        }

        // Show command list
        console.log('\n📋 Deployed Commands:');
        data.forEach(cmd => {
            console.log(`  /${cmd.name} - ${cmd.description || 'No description'}`);
        });
        
        console.log('\n🚀 Deployment complete!');
        console.log('💡 To test commands immediately, use GUILD_ID for faster deployment.');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if DISCORD_TOKEN is valid');
        console.log('2. Check if CLIENT_ID is correct');
        console.log('3. Check if bot has application.commands scope');
        console.log('4. For guild deployment, ensure GUILD_ID is correct');
    }
})();