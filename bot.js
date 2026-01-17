/**
 * SURVIVAL AUTOMATION BOT - Main Launcher
 * Developer: RAK
 * Version: 1.0.0
 */

const { ShardingManager } = require('discord.js');
const path = require('path');
// Chalk 5+ requires different import for CommonJS
const chalk = require('chalk').default || require('chalk');
const fs = require('fs-extra');

// ASCII Art Banner
const banner = `
╔════════════════════════════════════════════════════╗
║                                                    ║
║   ███████╗██╗   ██╗██████╗ ██╗   ██╗██╗██╗       ║
║   ██╔════╝██║   ██║██╔══██╗██║   ██║██║██║       ║
║   ███████╗██║   ██║██████╔╝██║   ██║██║██║       ║
║   ╚════██║██║   ██║██╔══██╗╚██╗ ██╔╝██║██║       ║
║   ███████║╚██████╔╝██║  ██║ ╚████╔╝ ██║███████╗  ║
║   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝  ║
║                                                    ║
║   █████╗ ██╗   ██╗████████╗ ██████╗ ███╗   ███╗   ║
║  ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗████╗ ████║   ║
║  ███████║██║   ██║   ██║   ██║   ██║██╔████╔██║   ║
║  ██╔══██║██║   ██║   ██║   ██║   ██║██║╚██╔╝██║   ║
║  ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║ ╚═╝ ██║   ║
║  ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝     ╚═╝   ║
║                                                    ║
║     SURVIVAL AUTOMATION BOT v1.0.0                 ║
║     Developer: RAK                                 ║
║     "Auto-React | Music | Art | Automation"        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
`;

console.log(chalk.hex('#00FFFF')(banner)); // Using hex color instead of cyan

// Check for required files
const requiredFiles = ['.env', 'config.json', 'package.json'];
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.log(chalk.hex('#FF0000')(`❌ Missing required file: ${file}`));
        
        if (file === '.env') {
            console.log(chalk.hex('#FFFF00')('📝 Creating .env file...'));
            const envContent = `# SURVIVAL AUTOMATION BOT
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here
OWNER_ID=your_discord_id_here

# OPTIONAL
# DEPLOY_GLOBAL=true
# CLEAR_COMMANDS=true
# SHARD_COUNT=auto

# LOGGING
LOG_LEVEL=info
`;
            
            fs.writeFileSync('.env', envContent);
            console.log(chalk.hex('#00FF00')('✅ Created .env file'));
            console.log(chalk.hex('#FFFF00')('⚠️ Please edit .env with your credentials'));
        } else if (file === 'config.json') {
            console.log(chalk.hex('#FFFF00')('📝 Creating config.json...'));
            const defaultConfig = {
                botName: "Survival Automation",
                version: "1.0.0",
                prefix: "!",
                enablePrefix: true,
                ownerId: "YOUR_DISCORD_ID",
                
                autoReact: {
                    defaultIntroReactions: ["✨", "👋"],
                    defaultMusicReactions: ["🎵", "🎧", "🔥"],
                    defaultArtReactions: ["🎨", "✨", "👌"]
                },
                
                status: {
                    rotationEnabled: true,
                    rotationInterval: 300000
                },
                
                features: {
                    enableAutoWelcome: true,
                    enableReactionCount: true,
                    enableCommandLogging: true
                }
            };
            
            fs.writeJsonSync('config.json', defaultConfig, { spaces: 2 });
            console.log(chalk.hex('#00FF00')('✅ Created config.json'));
            console.log(chalk.hex('#FFFF00')('⚠️ Please edit config.json with your settings'));
        }
    }
}

// Load environment variables
require('dotenv').config();

// Check for bot token
if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN === 'your_bot_token_here') {
    console.log(chalk.hex('#FF0000')('❌ DISCORD_TOKEN is not set in .env file'));
    console.log(chalk.hex('#FFFF00')('📝 Please edit .env file with your bot token'));
    process.exit(1);
}

// Function to start bot
async function startBot(sharding = false) {
    try {
        if (sharding) {
            const shardCount = process.env.SHARD_COUNT || 'auto';
            console.log(chalk.hex('#FFFF00')(`🚀 Starting bot with ${shardCount} shards...`));
            
            const manager = new ShardingManager('./index.js', {
                token: process.env.DISCORD_TOKEN,
                totalShards: shardCount === 'auto' ? 'auto' : parseInt(shardCount),
                respawn: true,
                timeout: -1
            });
            
            manager.on('shardCreate', shard => {
                console.log(chalk.hex('#0000FF')(`🔧 Launched shard ${shard.id}`));
                
                shard.on('ready', () => {
                    console.log(chalk.hex('#00FF00')(`✅ Shard ${shard.id} ready`));
                });
                
                shard.on('disconnect', () => {
                    console.log(chalk.hex('#FFFF00')(`⚠️ Shard ${shard.id} disconnected`));
                });
                
                shard.on('reconnecting', () => {
                    console.log(chalk.hex('#FFFF00')(`🔄 Shard ${shard.id} reconnecting`));
                });
                
                shard.on('death', () => {
                    console.log(chalk.hex('#FF0000')(`❌ Shard ${shard.id} died`));
                });
            });
            
            await manager.spawn();
            
        } else {
            console.log(chalk.hex('#FFFF00')('🚀 Starting bot without sharding...'));
            
            // Show startup info
            console.log(chalk.hex('#0000FF')('📊 Startup Information:'));
            console.log(chalk.hex('#FFFFFF')(`• Bot Name: Survival Automation`));
            console.log(chalk.hex('#FFFFFF')(`• Version: 1.0.0`));
            console.log(chalk.hex('#FFFFFF')(`• Prefix: ${require('./config.json').prefix || '!'}`));
            console.log(chalk.hex('#FFFFFF')(`• Developer: RAK`));
            console.log(chalk.hex('#FFFFFF')(`• Features: Auto-React, Music, Art, Multi-Server`));
            
            // Load and start main bot
            require('./index.js');
        }
        
        console.log(chalk.hex('#00FF00')('\n✅ Bot started successfully!'));
        console.log(chalk.hex('#00FFFF')('🎵 Ready to auto-react! 🎨'));
        
    } catch (error) {
        console.log(chalk.hex('#FF0000')('❌ Failed to start bot:'), error);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldShard = args.includes('--shard') || process.env.SHARD_COUNT !== '1';

// Start bot
startBot(shouldShard);

// Handle process signals
process.on('SIGINT', () => {
    console.log(chalk.hex('#FFFF00')('\n🛑 Received SIGINT signal'));
    console.log(chalk.hex('#0000FF')('👋 Shutting down gracefully...'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(chalk.hex('#FFFF00')('\n🛑 Received SIGTERM signal'));
    console.log(chalk.hex('#0000FF')('👋 Shutting down gracefully...'));
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.log(chalk.hex('#FF0000')('\n❌ Uncaught Exception:'), error);
    console.log(chalk.hex('#FFFF00')('🔄 Restarting bot in 5 seconds...'));
    
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.hex('#FF0000')('\n❌ Unhandled Rejection at:'), promise);
    console.log(chalk.hex('#FF0000')('Reason:'), reason);
});

// Export for testing
module.exports = { startBot };