# 🎵 Survival Automation Bot

<div align="center">

![Discord Bot](https://img.shields.io/badge/Discord_Bot-100%25_Automated-7289DA?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-14.x-5865F2?style=for-the-badge&logo=discord)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

*A powerful Discord bot with auto-react features for music communities*

</div>

## ✨ **Features**

### 🤖 **Auto-React System**
- **✨ Intro Auto-React**: Automatically reacts to introductions with sparkle effects
- **🎵 Music Auto-React**: Reacts to music file submissions with animated emojis
- **🎨 Art Auto-React**: Reacts to artwork/images with artistic flair
- **🔧 Customizable**: Set custom channels and reaction emojis
- **🌈 Visual Effects**: Smooth animations and particle effects

### ⚡ **Commands**
- **Slash Commands**: Modern `/` commands
- **Prefix Commands**: Traditional `!` commands
- **Dual Support**: Both command systems work simultaneously
- **Mobile Optimized**: Touch-friendly interface

### 🚀 **Other Features**
- **Multi-Server Ready**: Built for public use
- **Status Rotation**: Customizable bot status
- **Auto Welcome**: Welcome messages in DMs
- **Command Logging**: Tracks all commands
- **Error Handling**: Graceful error recovery
- **Special Effects**: Celebration animations for milestones

## 📦 **Installation**

### **Prerequisites**
- Node.js 16.9.0 or higher
- Discord Bot Token
- Basic terminal knowledge

### **Step 1: Clone Repository**
```bash
git clone https://github.com/RAK-MUSIC/survival-automation-bot.git
cd survival-automation-bot
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure Bot**
```bash
cp .env.example .env
```

Edit `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here
OWNER_ID=your_discord_id_here
```

### **Step 4: Deploy Commands**
```bash
npm run deploy
```

### **Step 5: Start Bot**
```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

## 📖 **Commands**

### **Administrator Commands**
| Command | Description | Example |
|---------|-------------|---------|
| `/intro-react set` | Set introduction channel | `/intro-react set #welcome` |
| `/music-react set` | Set music submission channel | `/music-react set #music` |
| `/art-react set` | Set artwork channel | `/art-react set #artwork` |
| `/bot-status add` | Add bot status rotation | `/bot-status add "🎵 Playing Music"` |

### **User Commands**
| Command | Description | Effect |
|---------|-------------|--------|
| `/ping` | Check bot latency | ⚡ Speed display |
| `/help` | Show all commands | 📖 Interactive guide |
| `!ping` | Prefix version of ping | ⚡ Same as slash |

## 🏗️ **Project Structure**

```
survival-automation-bot/
├── bot.js                 # Main launcher
├── index.js              # Bot core
├── deploy-commands.js    # Command deployer
├── config.json           # Bot configuration
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
└── commands/            # Command files
    ├── intro-react.js
    ├── music-react.js
    ├── art-react.js
    ├── ping.js
    ├── help.js
    └── autobotstatusupdate.js
```

## 🎨 **Customization**

### **Channel Setup**
Configure auto-react channels using these commands:
- `/intro-react set #channel-name` - Set introduction channel
- `/music-react set #channel-name` - Set music channel
- `/art-react set #channel-name` - Set art channel

### **Reaction Emojis**
Default emojis used:
- **Introductions**: 👋, 🤝, ✨
- **Music**: 🎵, 🎶, 🔊
- **Artwork**: 🎨, 🖼️, 👏

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📞 **Support**

- **Create an Issue**: [GitHub Issues](https://github.com/RAK-MUSIC/survival-automation-bot/issues)
- **Join our Discord Server**: [Discord Invite Link]
- **Email Support**: your-email@example.com

## 👤 **Developer**

**RAK** - Music Producer & Developer  
- **GitHub**: [@codesbySurvive](https://github.com/codesbySurvive)
- **Discord**: RAK#0000

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ **Star this repository if you found it useful!** ⭐

**Experience the cool effects and smooth automation!** ✨🎵🎨

</div>
```
