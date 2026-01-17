# 🎵 Survival Automation Bot

A powerful Discord bot with auto-react features for music communities. Automatically reacts to introductions, music submissions, and artwork.

![Discord.js](https://img.shields.io/badge/Discord.js-14.14.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.9.0%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🤖 Auto-React System
- **✨ Intro Auto-React**: Automatically reacts to introductions
- **🎵 Music Auto-React**: Reacts to music file submissions
- **🎨 Art Auto-React**: Reacts to artwork/images
- **🔧 Customizable**: Set custom channels and reaction emojis

### ⚡ Commands
- **Slash Commands**: Modern `/` commands
- **Prefix Commands**: Traditional `!` commands
- **Dual Support**: Both command systems work simultaneously

### 🚀 Other Features
- **Multi-Server Ready**: Built for public use
- **Status Rotation**: Customizable bot status
- **Auto Welcome**: Welcome messages in DMs
- **Command Logging**: Tracks all commands
- **Error Handling**: Graceful error recovery

## 📦 Installation

### Prerequisites
- Node.js 16.9.0 or higher
- Discord Bot Token
- Basic terminal knowledge

### Step 1: Clone Repository
```bash
git clone https://github.com/RAK-MUSIC/survival-automation-bot.git
cd survival-automation-bot
Step 2: Install Dependencies
bash
npm install
Step 3: Configure Bot
Copy .env.example to .env:

bash
cp .env.example .env
Edit .env file:

env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here
OWNER_ID=your_discord_id_here
Step 4: Start Bot
bash
npm start
For development with auto-restart:

bash
npm run dev
🤖 Bot Commands
Admin Commands
Command	Description
/intro-react set #channel	Set introduction channel
/music-react set #channel	Set music submission channel
/art-react set #channel	Set artwork channel
/bot-status add	Add bot status rotation
User Commands
Command	Description
/ping	Check bot latency and status
/help	Show all commands
!ping	Prefix version of ping
🛠️ Project Structure
text
survival-automation-bot/
├── bot.js              # Main launcher
├── index.js           # Bot core
├── deploy-commands.js # Command deployer
├── config.json        # Bot configuration
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── commands/         # Command files
    ├── intro-react.js
    ├── music-react.js
    ├── art-react.js
    ├── ping.js
    ├── help.js
    └── autobotstatusupdate.js
🔧 Configuration
config.json
json
{
  "botName": "Survival Automation",
  "prefix": "!",
  "enablePrefix": true,
  "ownerId": "YOUR_ID"
}
.env File
Required variables:

DISCORD_TOKEN: Bot token from Discord Developer Portal

CLIENT_ID: Your bot's client ID

GUILD_ID: Your server ID (for instant commands)

OWNER_ID: Your Discord user ID

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

🐛 Support
Create an Issue

Join our Discord Server

👤 Developer
RAK - Music Producer & Developer

GitHub: @codesbySurvive


⭐ Star this repository if you found it useful!
