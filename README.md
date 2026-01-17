# 🎵 Survival Automation Bot

<div align="center">
  
![Discord Bot](https://img.shields.io/badge/Discord_Bot-100%25_Automated-7289DA?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-14.x-5865F2?style=for-the-badge&logo=discord)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
  
*A feature-rich Discord bot with stunning auto-reaction effects for music communities*

</div>

## ✨ **Features**

### 🎭 **Auto-Reaction System**
- **Smart Detection** - Automatically identifies content types
- **Dynamic Reactions** - Context-aware emoji responses
- **Multi-Channel Support** - Works across multiple channels simultaneously

### 🎯 **Content Types Detected**
| Type | Emoji | Effect |
|------|-------|--------|
| 🎵 **Music** | 🎶 🔊 🎧 | Animated music notes |
| 🎨 **Artwork** | 🖼️ 🎨 ✨ | Sparkle effects |
| 👋 **Introductions** | 👋 🤝 💫 | Welcome animations |
| 📹 **Videos** | 📹 🎥 🎬 | Play button effects |

### ⚡ **Command Systems**
**Slash Commands** (`/command`)
- Modern interface
- Auto-complete suggestions
- Mobile optimized

**Prefix Commands** (`!command`)
- Quick access
- Keyboard friendly
- Legacy support

### 🌟 **Special Effects**
- **Gradient Embeds** - Smooth color transitions
- **Animated Status** - Rotating presence with effects
- **Visual Feedback** - Particle effects on reactions
- **Celebration Mode** - Special effects for milestones

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16.9.0 or higher
- Discord Bot Token
- Basic terminal knowledge

### **1. Clone & Install**
```bash
git clone https://github.com/RAK-MUSIC/survival-automation-bot.git
cd survival-automation-bot
npm install
2. Configuration
bash
cp .env.example .env
Edit .env:

env
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
3. Launch Bot
bash
# Production
npm start

# Development (with auto-restart)
npm run dev

# Deploy commands
npm run deploy
📖 Commands
Administrator Commands
Command	Description	Example
/intro-react set	Set intro channel	/intro-react set #welcome
/music-react set	Set music channel	/music-react set #music
/art-react set	Set art channel	/art-react set #artwork
/status add	Add status message	/status add "🎵 Playing Music"
User Commands
Command	Description	Effect
/ping	Check bot latency	⚡ Speed display
/help	Show help menu	📖 Interactive guide
!ping	Prefix version	⚡ Same as slash
🏗️ Project Structure
text
survival-automation-bot/
├── src/
│   ├── commands/          # All command files
│   │   ├── admin/        # Admin commands
│   │   ├── user/         # User commands
│   │   └── utils/        # Utility commands
│   ├── events/           # Event handlers
│   ├── effects/          # Visual effects
│   └── core/             # Core bot logic
├── bot.js                # Main launcher
├── index.js             # Bot core
├── deploy-commands.js   # Command deployer
├── config.json          # Configuration
├── package.json         # Dependencies
└── .env                 # Environment variables
🎨 Customization
Channel Setup
javascript
// Example configuration
{
  "introChannel": "welcome",
  "musicChannel": "music-submissions",
  "artChannel": "artwork",
  "reactionEmojis": {
    "intro": ["👋", "🎉", "✨"],
    "music": ["🎵", "🎶", "🔥"],
    "art": ["🎨", "🖼️", "👏"]
  }
}
Effect Settings
Particle density

Animation speed

Color schemes

Sound effects (optional)

🤝 Contributing
We welcome contributions! Follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📞 Support
📋 Create an Issue

💬 Join Discord

📧 Email: your-email@example.com

👨‍💻 Developer
RAK - Music Producer & Developer

GitHub: @codesbySurvive

Discord: RAK#0000

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">
⭐ Star this repository if you found it useful! ⭐
Experience the cool effects and smooth automation!

</div> ```
